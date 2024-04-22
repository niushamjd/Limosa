/* global google */  // This tells ESLint that google is a global variable
export async function fetchNearbyRestaurants(mapRef, itinerary) {
    if (!mapRef.current) {
      console.error("Google Maps JavaScript API has not been loaded yet.");
      return [];
    }
  
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    let restaurantsArray = [];
  
    for (const [date, periods] of Object.entries(itinerary)) {
      for (const [period, activities] of Object.entries(periods)) {
        const lastPlace = activities.filter(activity => activity.type === "Place").pop();
  
        if (lastPlace) {
          const request = {
            query: lastPlace.name,
            fields: ["name", "geometry.location"],
          };
  
          try {
            const placeResults = await new Promise((resolve, reject) => {
              service.textSearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                  resolve(results);
                } else {
                  reject(`Place details not found for ${lastPlace.name}`);
                }
              });
            });
  
            const location = placeResults[0].geometry.location;
            const restaurantRequest = {
              location: location,
              radius: "1000",
              type: ["restaurant"],
            };
  
            const restaurantResults = await new Promise((resolve, reject) => {
              service.nearbySearch(restaurantRequest, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                  resolve(results);
                } else {
                  reject(`No nearby restaurants found for ${lastPlace.name}`);
                }
              });
            });
  
            restaurantResults.forEach(restaurant => {
              if (!restaurantsArray.some(r => r.name === restaurant.name)) {
                restaurantsArray.push({
                  name: restaurant.name,
                  activity: "Dining",
                  type: "Restaurant",
                  location: restaurant.vicinity,
                  photo: restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].getUrl() : ""
                });
              }
            });
  
            if (restaurantsArray.length >= 6) {
              break;
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      if (restaurantsArray.length >= 6) {
        break;
      }
    }
  
    return restaurantsArray;
  }

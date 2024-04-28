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
          fields: ["name", "geometry"],
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

          // Use the geometry from the place results as the location for nearby restaurants
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
            const coordinates = { // Extract coordinates
              latitude: restaurant.geometry.location.lat(),
              longitude: restaurant.geometry.location.lng()
            };
            if (!restaurantsArray.some(r => r.name === restaurant.name)) {
              restaurantsArray.push({
                name: restaurant.name,
                activity: "Dining",
                type: "Restaurant",
                location: restaurant.vicinity,
                coordinates, // Include coordinates for each restaurant
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

// Example function to fetch place details including coordinates
export const fetchPlaceDetails = async (placeName) => {
  const map = new window.google.maps.Map(document.createElement('div')); // Dummy map element for services
  const service = new window.google.maps.places.PlacesService(map);

  const searchRequest = {
      query: placeName,
      fields: ['place_id']
  };

  try {
      const searchResult = await new Promise((resolve, reject) => {
          service.findPlaceFromQuery(searchRequest, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                  resolve(results[0].place_id);
              } else {
                  reject('Place ID not found for ' + placeName);
              }
          });
      });

      const detailsRequest = {
          placeId: searchResult,
          fields: ['name', 'geometry']
      };

      const detailsResult = await new Promise((resolve, reject) => {
          service.getDetails(detailsRequest, (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                  resolve({
                      name: place.name,
                      coordinates: {
                          latitude: place.geometry.location.lat(),
                          longitude: place.geometry.location.lng()
                      }
                  });
              } else {
                  reject('Place details not found for ' + placeName);
              }
          });
      });

      return detailsResult;
  } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
  }
}

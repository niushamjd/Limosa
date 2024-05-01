/* global google */  // This tells ESLint that google is a global variable
export async function fetchNearbyRestaurants(mapRef, itinerary, budget) {
  if (!mapRef.current) {
    console.error("Google Maps JavaScript API has not been loaded yet.");
    return [];
  }

  const service = new window.google.maps.places.PlacesService(mapRef.current);
  let restaurantsArray = [];

  // Define a mapping from budget to price levels
  const budgetToPriceLevels = {
    Economic: [0, 1],  // Cheaper options
    Standard: [2],     // Mid-range options
    Luxury: [3, 4]     // More expensive options
  };

  // Get the appropriate price levels based on the budget
  const priceLevels = budgetToPriceLevels[budget] || [0, 1, 2, 3, 4];  // Default to all if budget is undefined

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

          const location = placeResults[0]?.geometry.location;
          if (!location) continue;  // Skip if no suitable location found

          const restaurantRequest = {
            location: location,
            radius: "1000",
            type: ["restaurant"],
          };

          const restaurantResults = await new Promise((resolve, reject) => {
            service.nearbySearch(restaurantRequest, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(results);
              } else {
                reject(`Search failed with status ${status} for ${lastPlace.name}`);
              }
            });
          });

          const filteredByBudget = restaurantResults.filter(r =>
            r.price_level !== undefined && priceLevels.includes(r.price_level)
          );

          filteredByBudget.forEach(restaurant => {
            const coordinates = {
              latitude: restaurant.geometry.location.lat(),
              longitude: restaurant.geometry.location.lng()
            };
            // Check for uniqueness based on name and vicinity
            if (!restaurantsArray.some(r => r.name === restaurant.name && r.location === restaurant.vicinity)) {
              restaurantsArray.push({
                name: restaurant.name,
                activity: "Dining",
                type: "Restaurant",
                location: restaurant.vicinity,
                coordinates,
                photo: restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].getUrl() : "",
                price: restaurant.price_level,
              });
            }
          });

          if (restaurantsArray.length >= 21) {
            break; // Adjusted limit as per requirements
          }
        } catch ( error) {
          console.error(error);
        }
      }
    }
    if (restaurantsArray.length >= 21) {
      break; // Exit if we have collected enough restaurants
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

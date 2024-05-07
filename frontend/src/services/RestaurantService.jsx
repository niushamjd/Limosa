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
            radius: "5000",
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
const getCityLocation = async (cityName) => {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=AIzaSyBA5ofh8H6x4Ycow_y-Bv5VF_BhrtU0Lz8`;
  const response = await fetch(geocodeUrl);
  const data = await response.json();
  if (data.status === "OK") {
    return data.results[0].geometry.location; // returns { lat, lng }
  } else {
    throw new Error("Failed to geocode city name");
  }
};

// Example function to fetch place details including coordinates
export const fetchPlaceDetails = async (placeName, city = null) => {
  if (!city) {
    throw new Error(`City parameter is required but not provided.`);
  }

  const location = await getCityLocation(city);
  const map = new window.google.maps.Map(document.createElement('div'));
  const service = new window.google.maps.places.PlacesService(map);
  const radius = 7000; // Reduced radius for more localized results

  try {
    const searchResults = await new Promise((resolve, reject) => {
      service.textSearch({
        query: `${placeName}`,
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: radius,
      }, handleSearchResults(resolve, reject));
    });

    return processSearchResults(searchResults, service);
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

const handleSearchResults = (resolve, reject) => (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
    resolve(results);
  } else {
    reject(`No places found, status: ${status}`);
  }
};



const formatPlaceDetails = (place) => {
  return {
    name: place.name,
    address: place.formatted_address,
    phoneNumber: place.formatted_phone_number,
    website: place.website,
    openingHours: place.opening_hours ? place.opening_hours.weekday_text : [],
    photos: place.photos ? place.photos.map(photo => photo.getUrl()) : [],
    coordinates: {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    }
  };
};
export const fetchPlaceCoordinates = async (placeName, city = null) => {
  if (!city) {
    throw new Error(`City parameter is required but not provided.`);
  }

  const location = await getCityLocation(city);
  const map = new window.google.maps.Map(document.createElement('div'));
  const service = new window.google.maps.places.PlacesService(map);
  const radius = 30000; // Reduced radius for more localized results

  try {
    const searchResults = await new Promise((resolve, reject) => {
      service.textSearch({
        query: `${placeName} ${city}`, // Append the city to the query
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: radius,
      }, handleSearchResults(resolve, reject));
    });

    // Filter search results to find the exact match for place name and city
    const filteredResults = searchResults.filter(result => 
      result.name.toLowerCase().includes(placeName.toLowerCase()) && 
      result.formatted_address.toLowerCase().includes(city.toLowerCase())
    );

    if (filteredResults.length > 0 && filteredResults[0].geometry && filteredResults[0].geometry.location) {
      const coordinates = {
        latitude: filteredResults[0].geometry.location.lat(),
        longitude: filteredResults[0].geometry.location.lng()
      };
      console.log(`Coordinates found for ${placeName} in ${city}:`, coordinates);
      return coordinates;
    } else {
      console.error(`Coordinates not found for ${placeName} in ${city}`);
      throw new Error(`Coordinates not found for ${placeName} in ${city}`);
    }
  } catch (error) {
    console.error('Error fetching place coordinates:', error);
    throw error;
  }
};


const processSearchResults = async (searchResults, service) => {
  const detailsRequests = searchResults.map(result => new Promise((resolve, reject) => {
    service.getDetails({
      placeId: result.place_id,
      fields: ['name', 'geometry', 'formatted_address', 'formatted_phone_number', 'website', 'opening_hours', 'photos', ]
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(formatPlaceDetails(place));
      } else {
        reject('Details not found for ' + result.name);
      }
    });
  }));
  return Promise.all(detailsRequests);
};


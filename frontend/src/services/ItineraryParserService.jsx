export const addRestaurantsToItinerary = (itinerary, restaurants) => {
    const updatedItinerary = { ...itinerary };
    let restaurantIndex = 0; // To keep track of which restaurant to add next

    // Iterate over each date in the itinerary
    for (const date in updatedItinerary) {
      if (!updatedItinerary.hasOwnProperty(date)) {
        continue;
      }

      // Go through each period: morning, afternoon, evening
      ["morning", "afternoon", "evening"].forEach((period) => {
        if (updatedItinerary[date][period] && restaurants[restaurantIndex]) {
          // Add a restaurant to the current period
          updatedItinerary[date][period].push({
            name: restaurants[restaurantIndex].name,
            activity: "Dining at " + restaurants[restaurantIndex].name,
            type: "Restaurant",
            location: restaurants[restaurantIndex].location,
            photo: restaurants[restaurantIndex].photo,
          });

          // Increment to use the next restaurant for the next period
          restaurantIndex = (restaurantIndex + 1) % restaurants.length; // Loop back if end is reached
        }
      });

      // Optional: Stop adding if you've cycled through all restaurants once
      if (restaurantIndex >= restaurants.length) {
        break; // Remove this if you want to cycle restaurants until all periods are filled
      }
    }
    return updatedItinerary;
  }


  export const parseItineraryResponse = (itineraryResponse) => {
    const itineraryObj = {};
    const days = itineraryResponse.split("Day ").slice(1); // Split response by "Day" and ignore the first empty split

    days.forEach((day) => {
      const lines = day.split("\n").map((line) => line.trim()); // Trim lines to remove any extraneous whitespace
      const dateLine = lines.shift(); // The first line contains the date
      const date = dateLine.match(/\d+ \w+ \d{4}/)[0]; // Extract the date with better regex

      itineraryObj[date] = { morning: [], afternoon: [], evening: [] };
      let currentPeriod = "morning";

      lines.forEach((line, index) => {
        if (line.includes("Morning:")) currentPeriod = "morning";
        else if (line.includes("Afternoon:")) currentPeriod = "afternoon";
        else if (line.includes("Evening:")) currentPeriod = "evening";
        else if (
          line.startsWith("- Place:") ||
          line.startsWith("- Restaurant:")
        ) {
          // The next line is assumed to be the activity description
          const activityLine = lines[index + 1]; // Get the next line for the activity
          const name = line.split(":")[1].trim();
          const activity = activityLine
            ? activityLine.split(":")[1].trim()
            : "";

          itineraryObj[date][currentPeriod].push({
            type: line.startsWith("- Place:") ? "Place" : "Restaurant",
            name: name,
            activity: activity,
          });
        }
      });
    });
    return itineraryObj;
  };

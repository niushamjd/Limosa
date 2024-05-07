// itineraryService.js
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "sk-proj-2uSf3vMsPUE6vqaWBC85T3BlbkFJcLO6sX8CL9PxZYmukwQb",
    dangerouslyAllowBrowser: true,
});

export const generateItineraryPrompt = (destination, peopleGroup, budget, user, dateRange,groupName) => {
  const fetchCommonInterests = (groupName) => {
    // Find the group object with the given groupName
    const group = user.groups.find(group => group.groupName === groupName);
  
    // If group is found, return its commonInterests, otherwise return an empty array
    return group ? group.commonInterests : [];
  };
  const commonInterests = fetchCommonInterests(groupName);
  
    return  prompt = `Generate a structured travel itinerary for ${destination} for a ${peopleGroup.toLowerCase()} with a ${budget.toLowerCase()} budget considering user interests in ${
        user.interests
      } and ${commonInterests}from ${dateRange[0].format("YYYY-MM-DD")} to ${dateRange[1].format(
        "YYYY-MM-DD"
      )}, covering each day including last day(pay attention to generating itenary for all included days), when selected start and end date are same, only generate for a single day but if it is not same date create for all dates exactly . Divide the itinerary into morning, afternoon, and evening sections for each day. For each period, suggest two places to visit but not food or restaurants. Present the itinerary with explicit headings for each day and period, followed by the names of places to visit, each accompanied by a brief description.
  
        Example format:
        Day 1: Tuesday, 19 Mar 2024
        Morning:
        - Place: Hagia Sophia
          Activity: Explore the iconic museum's stunning architecture and delve into its history as a church, mosque, and museum.
        - Place: Topkapi Palace
          Activity: Discover the luxurious residence of the Ottoman sultans, its exquisite architecture, and the historical artifacts within.
        
        Afternoon:
        - Place: Blue Mosque
          Activity: Visit the Blue Mosque to marvel at its striking blue tiles and majestic domes.
        - Place: Basilica Cistern
          Activity: Explore the ancient underground waterway with its mystical atmosphere and Medusa head pillars.
        
        Evening:
        - Place: Galata Tower
          Activity: Climb the Galata Tower for breathtaking panoramic views of Istanbul, especially beautiful at sunset.
        - Place: Istiklal Street
          Activity: Stroll down Istiklal Street, enjoying the vibrant nightlife, shopping, and dining options available.
        
        Day 2: Wednesday, 20 Mar 2024
        Morning:
        - Place: Dolmabahce Palace
          Activity: Tour the opulent Dolmabahce Palace, admiring its lavish decor and the beautiful Bosphorus views.
        - Place: Istanbul Modern
          Activity: Visit Istanbul Modern to see contemporary art exhibitions showcasing Turkish and international artists.
        
        Afternoon:
        - Place: Spice Bazaar
          Activity: Experience the scents and colors of the Spice Bazaar, where you can find a variety of spices, teas, and Turkish delights.
        - Place: Suleymaniye Mosque
          Activity: Visit the Suleymaniye Mosque, a masterpiece of Ottoman architecture, to appreciate its beauty and serene atmosphere.
        
        Evening:
        - Place: Bosphorus Cruise
          Activity: Take a Bosphorus cruise to see Istanbul's skyline from the water, including historical sites along the European and Asian shores.
        - Place: Balat Neighborhood
          Activity: Wander through the colorful streets of Balat, known for its picturesque houses, trendy cafes, street art, and a mix of Jewish, Greek, and Armenian heritage.
        
        **Tips:**
        - Use public transportation such as trams and buses for cost-effective travel.
        - Stay in centrally located accommodations to explore major sites on foot.
        - Try local foods like kebabs, baklava, and Turkish tea to immerse yourself in Turkish culture.
        - Respect local customs and dress modestly when visiting religious sites.`;
};

export const fetchItinerary = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        return response.choices[0].message.content;  // Assuming the response structure, adjust accordingly
    } catch (error) {
        console.error("Failed to fetch itinerary:", error);
        throw error;
    }
};

// Add other necessary functions and exports similar to above


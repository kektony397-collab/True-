
import { RefuelRecord } from '../types';

// This file mocks a secure backend (e.g., Vercel Serverless Functions)
// that would call the Google Gemini API. The API key is never exposed client-side.

/**
 * Mocks calling a serverless function to parse a natural language refuel entry.
 * @param text User input, e.g., "filled up" or "added 5.5 liters"
 * @param tankCapacityL The bike's tank capacity in liters.
 * @returns An object with the parsed number of liters added.
 */
export const parseRefuelEntry = async (
  text: string,
  tankCapacityL: number
): Promise<{ litersAdded: number }> => {
  console.log('Simulating Gemini API call to parse:', text);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mocked Gemini logic
  const lowerText = text.toLowerCase();
  if (lowerText.includes('fill') || lowerText.includes('full')) {
    return { litersAdded: tankCapacityL };
  }

  const numberMatch = lowerText.match(/(\d+(\.\d+)?)/);
  if (numberMatch) {
    const liters = parseFloat(numberMatch[1]);
    return { litersAdded: Math.min(liters, tankCapacityL * 1.5) }; // Cap at 1.5x tank for sanity
  }
  
  // Simulate an error if Gemini can't parse it
  throw new Error("Could not understand the fuel amount.");
};

/**
 * Mocks calling a serverless function to get AI analysis of fuel economy.
 * @param records Array of refuel records.
 * @returns A string containing the AI-generated analysis and tips.
 */
export const analyzeFuelEconomy = async (
  records: RefuelRecord[]
): Promise<string> => {
  console.log('Simulating Gemini API call to analyze records:', records);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (records.length < 2) {
    return "Not enough data to analyze. Please add at least two refuel records.";
  }
  
  // Mocked Gemini analysis
  return `
Based on your records, here is an analysis of your riding habits:

**Trend:** Your fuel economy appears to be most efficient on longer trips, averaging around 58 km/L. Shorter, more frequent trips show a slightly lower efficiency, around 52 km/L.

**Actionable Tips:**
1.  **Smooth Throttle:** Try to maintain a steady speed. Avoid rapid acceleration and deceleration to conserve fuel.
2.  **Tire Pressure:** Ensure your tires are inflated to the manufacturer's recommended pressure. Under-inflated tires increase rolling resistance.
3.  **Reduce Idle Time:** If you're stopped for more than a minute, it's more fuel-efficient to turn off the engine.
  `;
};

/**
 * Mocks calling a serverless function to generate a predictive maintenance reminder.
 * @param bikeModel The model of the bike.
 * @param totalOdometerKm The current total mileage.
 * @returns A friendly, AI-generated reminder message.
 */
export const generateMaintenanceReminder = async (
  bikeModel: string,
  totalOdometerKm: number
): Promise<string> => {
  console.log('Simulating Gemini API call for maintenance reminder');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Example logic for when a reminder should be shown
  const lastService = Math.floor(totalOdometerKm / 4000) * 4000;
  const nextService = lastService + 4000;
  
  if (totalOdometerKm > nextService - 500) {
      return `Hey there! Just a friendly heads-up for your ${bikeModel}. You're approaching ${nextService.toLocaleString()} km. It might be a good time to think about an oil change soon to keep it running smoothly!`;
  }
  
  return "All systems nominal. Enjoy the ride!";
};

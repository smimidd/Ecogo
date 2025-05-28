import axios from "axios"

interface CO2SavingsInput {
  distance: number // in kilometers
  vehicleType: string // "electric", "hybrid", "plugin-hybrid"
  passengers: number
}

interface CarbonFootprintResponse {
  co2_saved: number // in kg
}

export async function calculateCO2Savings(input: CO2SavingsInput): Promise<number> {
  try {
    // Calculate baseline emissions (average car)
    const baselineEmissions = await axios.post<CarbonFootprintResponse>(
      "https://api.carbonfootprint.com/v1/calculate",
      {
        type: "vehicle",
        mode: "car",
        distance: input.distance,
        unit: "km"
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.CARBON_FOOTPRINT_API_KEY}`
        }
      }
    )

    // Calculate actual emissions based on vehicle type
    const emissionFactors = {
      "electric": 0, // Electric vehicles have zero direct emissions
      "hybrid": 0.4, // Hybrid vehicles emit about 40% of a regular car
      "plugin-hybrid": 0.2 // Plug-in hybrids emit about 20% of a regular car
    }

    const actualEmissions = baselineEmissions.data.co2_saved * emissionFactors[input.vehicleType as keyof typeof emissionFactors]
    
    // Calculate savings
    const savings = baselineEmissions.data.co2_saved - actualEmissions

    // Add passenger multiplier (each additional passenger increases savings)
    const passengerMultiplier = Math.min(1 + (input.passengers - 1) * 0.5, 3)
    // Cap the multiplier at 3x (even with full car)

    return savings * passengerMultiplier
  } catch (error) {
    console.error("Error calculating CO2 savings:", error)
    // Fallback calculation if API fails
    return fallbackCO2Calculation(input)
  }
}

// Fallback calculation using average values
function fallbackCO2Calculation(input: CO2SavingsInput): number {
  // Average car emits about 120g CO2 per km
  const baselineEmissions = input.distance * 0.12 // kg CO2

  const emissionFactors = {
    "electric": 0,
    "hybrid": 0.4,
    "plugin-hybrid": 0.2
  }

  const actualEmissions = baselineEmissions * emissionFactors[input.vehicleType as keyof typeof emissionFactors]
  const savings = baselineEmissions - actualEmissions
  const passengerMultiplier = Math.min(1 + (input.passengers - 1) * 0.5, 3)

  return savings * passengerMultiplier
} 
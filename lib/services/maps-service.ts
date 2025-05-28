import axios from "axios"

interface Location {
  lat: number
  lng: number
  address: string
}

interface RouteResponse {
  distance: number // in kilometers
  duration: number // in minutes
  geometry: {
    coordinates: [number, number][]
  }
}

export class MapsService {
  private readonly NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"
  private readonly OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving"

  // Geocode an address to coordinates
  async geocodeAddress(address: string): Promise<Location> {
    try {
      // Add a delay to respect Nominatim's usage policy (1 request per second)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await axios.get(`${this.NOMINATIM_BASE_URL}/search`, {
        params: {
          q: address,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "EcoRide-Carpooling/1.0"
        }
      })

      if (!response.data?.[0]) {
        throw new Error(`Could not geocode address: ${address}`)
      }

      const result = response.data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      throw new Error(`Failed to geocode address: ${address}`)
    }
  }

  // Calculate route between two points
  async calculateRoute(from: Location, to: Location): Promise<{ distance: number; duration: number }> {
    try {
      const response = await axios.get(
        `${this.OSRM_BASE_URL}/${from.lng},${from.lat};${to.lng},${to.lat}`,
        {
          params: {
            overview: "full",
            alternatives: false,
            steps: false
          }
        }
      )

      if (!response.data?.routes?.[0]) {
        throw new Error("Could not calculate route")
      }

      const route = response.data.routes[0]
      return {
        distance: route.distance / 1000, // Convert to kilometers
        duration: Math.ceil(route.duration / 60) // Convert to minutes
      }
    } catch (error) {
      console.error("Route calculation error:", error)
      throw new Error("Failed to calculate route")
    }
  }

  // Get reverse geocoding (coordinates to address)
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      // Add a delay to respect Nominatim's usage policy
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await axios.get(`${this.NOMINATIM_BASE_URL}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: "json"
        },
        headers: {
          "User-Agent": "EcoRide-Carpooling/1.0"
        }
      })

      return response.data?.display_name || "Unknown location"
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return "Unknown location"
    }
  }
} 
import { NextResponse } from "next/server"

// List of major Moroccan cities
const MOROCCAN_CITIES = [
  { name: "Casablanca" },
  { name: "Rabat" },
  { name: "Marrakech" },
  { name: "Fes" },
  { name: "Tangier" },
  { name: "Agadir" },
  { name: "Meknes" },
  { name: "Oujda" },
  { name: "Kenitra" },
  { name: "Tetouan" },
  { name: "El Jadida" },
  { name: "Safi" },
  { name: "Mohammedia" },
  { name: "Khouribga" },
  { name: "Beni Mellal" },
  { name: "Nador" },
  { name: "Taza" },
  { name: "Settat" },
  { name: "Larache" },
  { name: "Ksar El Kebir" },
  { name: "Khemisset" },
  { name: "Guelmim" },
  { name: "Berrechid" },
  { name: "Taourirt" },
  { name: "Essaouira" },
  { name: "Fnideq" },
  { name: "Sidi Slimane" },
  { name: "Errachidia" },
  { name: "Ouarzazate" },
  { name: "Sefrou" }
].sort((a, b) => a.name.localeCompare(b.name))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  // Filter cities based on the search query
  const filteredCities = MOROCCAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(query)
  )

  return NextResponse.json(filteredCities)
} 
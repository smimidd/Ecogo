"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CitySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
}

export function CitySearch({ value, onChange, placeholder = "Select a city...", label, error }: CitySearchProps) {
  const [open, setOpen] = React.useState(false)
  const [cities, setCities] = React.useState<{ name: string }[]>([])
  const [loading, setLoading] = React.useState(false)

  const searchCities = React.useCallback(async (query: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setCities(data)
    } catch (error) {
      console.error("Error fetching cities:", error)
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    searchCities("")
  }, [searchCities])

  const handleSelect = React.useCallback((selectedCity: string) => {
    onChange(selectedCity)
    setOpen(false)
  }, [onChange])

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error ? "border-red-500 focus:ring-red-500" : ""
            )}
          >
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {value ? cities.find((city) => city.name === value)?.name || value : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search cities..."
              onValueChange={(search) => searchCities(search)}
              className="h-9"
            />
            <CommandEmpty>
              {loading ? "Loading..." : "No city found."}
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {cities.map((city) => (
                <CommandItem
                  key={city.name}
                  value={city.name}
                  onSelect={handleSelect}
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{city.name}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 
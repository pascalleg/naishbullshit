"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    address: string
    city: string
    state: string
    country: string
    postal_code: string
    latitude: number
    longitude: number
  }) => void
  initialValue?: string
}

export function LocationAutocomplete({
  onLocationSelect,
  initialValue = "",
}: LocationAutocompleteProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isLoaded: isScriptLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    if (isScriptLoaded) {
      setIsLoaded(true)
    }
  }, [isScriptLoaded])

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  })

  const handleSelect = async (address: string) => {
    setValue(address, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      const addressComponents = results[0].address_components

      const location = {
        address: address,
        city: "",
        state: "",
        country: "",
        postal_code: "",
        latitude: lat,
        longitude: lng,
      }

      addressComponents.forEach((component) => {
        const types = component.types
        if (types.includes("locality")) {
          location.city = component.long_name
        } else if (types.includes("administrative_area_level_1")) {
          location.state = component.short_name
        } else if (types.includes("country")) {
          location.country = component.long_name
        } else if (types.includes("postal_code")) {
          location.postal_code = component.long_name
        }
      })

      onLocationSelect(location)
    } catch (error) {
      console.error("Error getting location details:", error)
    }
  }

  if (!isLoaded) {
    return <Input placeholder="Loading location autocomplete..." disabled />
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Enter venue address"
        className="w-full"
      />
      {status === "OK" && (
        <ul className="absolute z-10 w-full mt-1 bg-ethr-darkgray border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              description,
            } = suggestion

            return (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                {description}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
} 
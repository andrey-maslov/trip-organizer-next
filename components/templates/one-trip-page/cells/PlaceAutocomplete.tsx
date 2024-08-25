import { useEffect, useRef, useState } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { Input } from '@nextui-org/react'

const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY'

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
}

export const PlaceAutocomplete = ({
  onPlaceSelect,
}: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary('places')

  useEffect(() => {
    if (!places || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    }

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace())
    })
  }, [onPlaceSelect, placeAutocomplete])

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
    >
      <div className='autocomplete-container'>
        <Input ref={inputRef} />
      </div>
    </APIProvider>
  )
}

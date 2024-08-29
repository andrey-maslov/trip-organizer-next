import { useEffect, useRef, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Input } from '@nextui-org/react'

import { TripPoint } from '@/types/models'

interface PlaceAutocompleteProps {
  onPlaceSelect: ({ name, address, placeId }: TripPoint['place']) => void
  value: any
}

export const PlaceAutocomplete = ({
  onPlaceSelect,
  value,
}: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>()
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary('places')

  useEffect(() => {
    if (!places || !inputRef.current) return

    const options = {
      fields: ['name', 'formatted_address', 'address_components', 'place_id'],
    }

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace()

      onPlaceSelect({
        name: place.name ?? '',
        address: place.formatted_address ?? '',
        placeId: place.place_id ?? '',
      })
    })
  }, [onPlaceSelect, placeAutocomplete])

  return (
    <div className='autocomplete-container'>
      <Input ref={inputRef} defaultValue={value} value={value} />
    </div>
  )
}

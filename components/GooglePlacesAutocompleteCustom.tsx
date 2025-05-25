import React, { useCallback, useMemo, useState } from 'react'
import { useAutocompleteSuggestions } from '@/hooks/useAutocompleteSuggestions'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { TripPoint } from '@/components/one-trip-page/cells/TripPointCell'

// Example: https://codesandbox.io/p/sandbox/github/visgl/react-google-maps/tree/main/examples/autocomplete?file=%2Fsrc%2Fcomponents%2Fautocomplete-custom-hybrid.tsx%3A37%2C14-37%2C28

interface Props {
  onPlaceSelect: (place: any) => void
}

export const GooglePlacesAutocompleteCustom = ({ onPlaceSelect }: Props) => {
  const [inputValue, setInputValue] = useState<string>('')

  const { suggestions, resetSession, isLoading } =
    useAutocompleteSuggestions(inputValue)

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  const handleSelect = useCallback(
    (prediction: google.maps.places.PlacePrediction) => {
      const place = prediction.toPlace()

      // console.log('ST', prediction?.secondaryText?.text)
      // console.log('TT', prediction?.text.text)
      // console.log('MT', prediction.mainText?.text)

      place
        .fetchFields({
          fields: ['formattedAddress', 'location', 'id'],
        })
        .then((res) => {
          resetSession()

          const formattedPlace: TripPoint['place'] = {
            placeId: place.id,
            name: prediction?.text.text,
            secondaryName: prediction?.secondaryText?.text,
            address: res.place.formattedAddress ?? '',
          }

          onPlaceSelect(formattedPlace)
        })
    },
    [onPlaceSelect]
  )

  const predictions = useMemo(
    () =>
      suggestions
        .filter((suggestion) => suggestion.placePrediction)
        .map(({ placePrediction }) => placePrediction!),
    [suggestions]
  )

  return (
    <div className='autocomplete-container'>
      <Autocomplete
        className='max-w-xs'
        items={predictions}
        label='Place'
        placeholder='Search for a place'
        inputValue={inputValue}
        onSelectionChange={(key) => {
          const found = predictions.find((p) => p.placeId === key)
          if (found) handleSelect(found)
        }}
        onInputChange={handleInputChange}
      >
        {(prediction) => {
          return (
            <AutocompleteItem
              key={prediction.placeId}
              value={prediction.placeId}
              textValue={prediction.text?.text ?? ''}
            >
              {prediction.text?.text}
            </AutocompleteItem>
          )
        }}
      </Autocomplete>
    </div>
  )
}

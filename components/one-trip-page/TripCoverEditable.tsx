import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'throttle-debounce'

import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from '@heroui/react'
import { searchPictures } from '@/queries/queries.external'
import { defaultCoverImage } from '@/constants/defaultEntities'
import { sanitizeInput } from '@/lib/sanitizeInput'
import { Loader } from '@/components/Loader'
import { ButtonEdit } from '@/components/ButtonEdit'
import { UnsplashPhoto } from '@/types/types'
import clsx from 'clsx'

type Props = {
  coverSrc: string | undefined
  setCoverSrc: (src: string) => void
  tripName: string
}

export const TripCoverEditable = ({
  coverSrc,
  tripName,
  setCoverSrc,
}: Props) => {
  const [picsListOpen, setPicsListOpen] = useState(false)

  const [query, setQuery] = useState(tripName)
  const [inputValue, setInputValue] = useState(tripName)
  const [picsLoaded, setPicsLoaded] = useState<UnsplashPhoto[]>([])

  useEffect(() => {
    setQuery(tripName)
    setInputValue(tripName)
  }, [tripName])

  // Настраиваем задержку (debounce) на 500 мс
  const debouncedSetQuery = useMemo(
    () =>
      debounce(1000, (val: string) => {
        setQuery(val)
      }),
    []
  )

  // Обработчик изменения инпута
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value
      if (text.length > 20) return // Допустим, мы не даём вводить больше 20 символов

      const sanitizedText = sanitizeInput(text)
      setInputValue(sanitizedText)

      // Через 500 мс простоя обновится query
      debouncedSetQuery(sanitizedText)
    },
    [debouncedSetQuery]
  )

  // Запрос к API срабатывает только если модалка открыта и длина query >= 5
  const canFetchPics = picsListOpen && query.length >= 5

  const { data, isLoading } = useQuery({
    queryKey: ['pictures', query],
    queryFn: async () => {
      const res = await searchPictures(query)

      if (res.results.length > 0) {
        setPicsLoaded(res.results)
      }

      return res
    },
    enabled: canFetchPics && picsListOpen,
  })

  const img = coverSrc || defaultCoverImage

  return (
    <div className='relative editable-elemenet'>
      {img && (
        <Image
          alt='Trip cover'
          className='max-h-[200px] object-cover'
          fallbackSrc={defaultCoverImage}
          height={200}
          src={img}
          width={200}
        />
      )}
      {tripName.length >= 5 && (
        <ButtonEdit
          classNames='btn-edit bg-white shadow-md'
          onClick={() => setPicsListOpen(true)}
        />
      )}

      <Modal
        backdrop='opaque'
        isOpen={picsListOpen}
        size='4xl'
        onOpenChange={setPicsListOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Choose your cover image
              </ModalHeader>
              <ModalBody className='p-4 min-h-[300px] relative'>
                {isLoading && (
                  <div className='absolute w-full h-full flex items-center justify-center z-30'>
                    <Loader />
                  </div>
                )}
                <div>
                  <Input
                    className='w-1/2'
                    label='Name'
                    labelPlacement='outside'
                    placeholder='Enter name of your trip here'
                    type='text'
                    value={inputValue}
                    description='20 symbols max'
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div
                  className={clsx(
                    'grid grid-cols-2 md:grid-cols-4 gap-4',
                    isLoading && 'opacity-30'
                  )}
                >
                  {picsLoaded.map((picture) => (
                    <img
                      key={picture.id}
                      alt='Trip cover'
                      className='cursor-pointer w-[200px] h-[200px] object-cover rounded-2xl hover:opacity-50 transition ease-in-out'
                      src={picture.urls.small}
                      onClick={() => {
                        setCoverSrc(picture.urls.small)
                        onClose()
                      }}
                    />
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

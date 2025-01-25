import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react"
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { defaultCoverImage } from '@/constants/defaultEntities'
import { ButtonEdit } from '@/components/ButtonEdit'
import { searchPictures } from '@/queries/queries.external'

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

  const canFetchPics = picsListOpen && tripName.length >= 5

  const { data: pictures, isLoading: picturesLoading } = useQuery({
    queryKey: ['pictures', tripName],
    queryFn: () => searchPictures(tripName),
    enabled: canFetchPics,
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
        size='3xl'
        onOpenChange={setPicsListOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Choose you cover image
              </ModalHeader>
              <ModalBody>
                {picturesLoading ? (
                  <div>loading...</div>
                ) : (
                  <div className='grid grid-cols-4 gap-4'>
                    {pictures?.results.map((picture) => (
                      <Image
                        key={picture.id}
                        alt='Trip cover'
                        className='cursor-pointer'
                        height={300}
                        src={picture.urls.small}
                        width={300}
                        onClick={() => {
                          setCoverSrc(picture.urls.small)
                          onClose()
                        }}
                      />
                    ))}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

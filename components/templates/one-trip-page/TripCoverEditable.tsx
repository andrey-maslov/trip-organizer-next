import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { defaultCoverImage } from '@/constants/defaultEntities'
import { ButtonEdit } from '@/components/ButtonEdit'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchPictures } from '@/apiRequests/apiExternal'

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

  return (
    <div className='relative editable-elemenet'>
      <Image
        width={200}
        height={200}
        className='max-h-[200px] object-cover'
        alt='Trip cover'
        src={coverSrc}
        fallbackSrc={defaultCoverImage}
      />
      {tripName.length >= 5 && (
        <ButtonEdit onClick={() => setPicsListOpen(true)} />
      )}

      <Modal
        backdrop='opaque'
        size='3xl'
        isOpen={picsListOpen}
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
                        className='cursor-pointer'
                        key={picture.id}
                        width={300}
                        height={300}
                        alt='Trip cover'
                        src={picture.urls.small}
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

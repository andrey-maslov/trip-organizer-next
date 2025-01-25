import React, { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react"

import { Section } from '@/types/types'

type Props = {
  serviceProvider: Section['serviceProvider']
  onUpdate: (value: any) => void
}

export const ServiceProviderCell: React.FC<Props> = ({
  serviceProvider,
  onUpdate,
}) => {
  const [isOpen, setOpen] = useState(false)

  const [data, setData] = useState<Section['serviceProvider']>(serviceProvider)

  return (
    <div className='flex items-center relative w-full'>
      <Button
        fullWidth
        color='default'
        size='sm'
        variant='light'
        onPress={() => setOpen(true)}
      >
        {serviceProvider?.name ?? '+'}
      </Button>

      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        size='md'
        onOpenChange={() => setOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Set your service provider here
              </ModalHeader>
              <ModalBody>
                <Input
                  className='mb-1'
                  placeholder='Provider name'
                  size='sm'
                  value={data?.name}
                  onChange={(event) =>
                    setData((data) => ({ ...data, name: event.target.value }))
                  }
                />
                <Input
                  className='mb-2'
                  placeholder='Provider link'
                  size='sm'
                  value={data?.url}
                  onChange={(event) =>
                    setData((data) => ({ ...data, url: event.target.value }))
                  }
                />
                <div className='flex justify-end'>
                  <Button
                    color='primary'
                    onPress={() => {
                      onUpdate(data)
                      onClose()
                    }}
                  >
                    Save
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

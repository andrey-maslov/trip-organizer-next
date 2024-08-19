import React, { useState } from 'react'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

import { Section } from '@/types/models'

type Props = {
  serviceProvider: Section['serviceProvider']
  onUpdate: (value: any) => void
}

export const ServiceProviderCell: React.FC<Props> = ({
  serviceProvider,
  onUpdate,
}) => {
  const [editMode, setEditMode] = useState(false)
  // TODO Use form like react-hook form, etc.
  const [data, setData] = useState<Section['serviceProvider']>(serviceProvider)

  const onSaveData = () => {
    onUpdate(data)
    setEditMode(false)
    setData(serviceProvider)
  }

  return (
    <div className='flex items-center editable-elemenet relative'>
      <div>
        {serviceProvider?.url ? (
          <a
            className='text-blue-600 underline'
            href={serviceProvider.url}
            rel='noreferrer'
            target={'_blank'}
          >
            {serviceProvider.name}
          </a>
        ) : (
          <div>{serviceProvider?.name ?? '-'}</div>
        )}
      </div>
      <Popover showArrow isOpen={editMode} placement='right'>
        <PopoverTrigger>
          <Button
            isIconOnly
            aria-label='edit'
            className='btn-edit'
            color='warning'
            size='sm'
            variant='faded'
            onClick={() => setEditMode(true)}
          >
            <FiEdit2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className='px-1 py-2'>
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
            <div className='flex gap-2 justify-between'>
              <Button
                className='w-full'
                size='sm'
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                color='primary'
                size='sm'
                onClick={() => onSaveData()}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

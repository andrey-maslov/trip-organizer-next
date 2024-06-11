import React, { useState } from 'react'
import { Section } from '@/types/models'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

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
            href={serviceProvider.url}
            className='text-blue-600 underline'
            target={'_blank'}
            rel='noreferrer'
          >
            {serviceProvider.name}
          </a>
        ) : (
          <div>{serviceProvider?.name ?? '-'}</div>
        )}
      </div>
      <Popover placement='right' isOpen={editMode} showArrow>
        <PopoverTrigger>
          <Button
            isIconOnly
            size='sm'
            color='warning'
            variant='faded'
            aria-label='edit'
            className='btn-edit'
            onClick={() => setEditMode(true)}
          >
            <FiEdit2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className='px-1 py-2'>
            <Input
              size='sm'
              placeholder='Provider name'
              value={data?.name}
              onChange={(event) =>
                setData((data) => ({ ...data, name: event.target.value }))
              }
              className='mb-1'
            />
            <Input
              size='sm'
              placeholder='Provider link'
              value={data?.url}
              onChange={(event) =>
                setData((data) => ({ ...data, url: event.target.value }))
              }
              className='mb-2'
            />
            <div className='flex gap-2 justify-between'>
              <Button
                size='sm'
                className='w-full'
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                size='sm'
                className='w-full'
                color='primary'
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

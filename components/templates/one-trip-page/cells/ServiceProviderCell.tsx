import React, { ReactNode, useState } from 'react'
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa'
import { ImAirplane } from 'react-icons/im'
import { Section } from '@/types/models'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'
import { serviceProviderTypes } from '@/constants/constants'

const typeIcons: Record<string, ReactNode> = {
  bus: <FaBus />,
  flight: <ImAirplane />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
}

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
    <div className='flex items-center cell-editable relative'>
      <div className='mr-3 text-2xl text-foreground-400'>
        {typeIcons[serviceProvider?.type ?? 'unknown']}
      </div>
      <div>
        {/*<div>{serviceProvider?.type}</div>*/}
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
      <Popover
        placement='right'
        isOpen={editMode}
        showArrow
        // shouldCloseOnInteractOutside={(e) => setEditMode(false)}
      >
        {/*<ButtonEdit onClick={() => setEditMode(true)} />*/}
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
            {/* type - select */}
            <Select
              label='Select type'
              className='max-w-xs min-w-[100px] mb-1'
              size='sm'
              onChange={(event) => {
                setData((data) => ({ ...data, type: event.target.value }))
              }}
              selectedKeys={[data?.type ?? '']}
              // classNames={{
              //   trigger: 'h-4 min-h-unit-6',
              // }}
            >
              {serviceProviderTypes.map((type) => (
                <SelectItem key={type} textValue={type}>
                  <span className='text-xs'>{type}</span>
                </SelectItem>
              ))}
            </Select>
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

import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  getKeyValue,
  Selection,
} from '@nextui-org/react'
import { FiPlus, FiMoreVertical, FiChevronDown } from 'react-icons/fi'
import { Key, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { CellElement } from '@react-types/table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { capitalize, createNewSection } from '@/lib/utils'
import { Section, SectionBE } from '@/types/models'
import { ServiceProviderCell } from '@/components/templates/one-trip-page/cells/ServiceProviderCell'
import { StatusCell } from '@/components/templates/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { PriceCell } from '@/components/templates/one-trip-page/cells/PriceCell'
import { DurationCell } from '@/components/templates/one-trip-page/cells/DurationCell'
import { NoteCell } from '@/components/templates/one-trip-page/cells/NoteCell'
import { NameCell } from '@/components/templates/one-trip-page/cells/NameCell'
import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { updateSection } from '@/apiRequests/apiDB'
import { TripPointCell } from '@/components/templates/one-trip-page/cells/TripPointCell'
import { fakeStartPoint } from '@/constants/defaultEntities'
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
  simpleTableCells,
  statusOptions,
} from '@/components/templates/one-trip-page/trip-table.config'
import { TypeCell } from '@/components/templates/one-trip-page/cells/TypeCell'

interface OneTripTableProps {
  sections: SectionBE[]
}

export const TripTable = ({ sections }: OneTripTableProps) => {
  const queryClient = useQueryClient()
  const { id: tripId } = useParams()
  const [sectionsToDisplay, setSectionsToDisplay] = useState<Section[]>([])
  const [currentSection, setCurrentSection] = useState<Section | null>(null)
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    setSectionsToDisplay(
      (sections ?? []).map((section) => ({ ...section, id: section._id ?? '' }))
    )
  }, [sections])

  // Update Trip Section
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: (data: { tripId: string; sectionData: Partial<Section> }) =>
      updateSection(data.tripId, data.sectionData),
    onSuccess: async () => {
      toast.success('Section successfully updated')
      await queryClient.invalidateQueries({ queryKey: ['trip', tripId] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Section updating failed')
    },
  })

  const onSaveTableCell = (
    newValue: any,
    sectionId: string,
    columnKey: string
  ) => {
    if (!newValue || typeof tripId !== 'string') {
      return
    }

    const targetSection = sectionsToDisplay.find(
      (section) => sectionId === section.id
    )

    if (!targetSection) {
      return
    }

    let newSectionData: Section = { ...targetSection }

    if (simpleTableCells.includes(columnKey)) {
      newSectionData = { ...newSectionData, [columnKey]: newValue }
    }

    if ((columnKey = 'transportType')) {
      // think about cell
    }

    // TODO what about new section creating when we don't have a section ID?

    updateSectionMutation({ tripId, sectionData: newSectionData })
  }

  // TODO only for Frontend...
  const onAddNewSection = () => {
    setSectionsToDisplay((prevSections) => [
      ...prevSections,
      createNewSection(prevSections.length),
    ])
    toast.success('Section added', {
      position: 'top-center',
    })
  }

  const topContent = useMemo(
    () => (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <div className='w-full' />
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={<FiChevronDown className='text-small' />}
                  size='sm'
                  variant='flat'
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={<FiChevronDown className='text-small' />}
                  size='sm'
                  variant='flat'
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              endContent={<FiPlus />}
              size='sm'
              onClick={() => onAddNewSection()}
            >
              Add New
            </Button>
            {/*<Button*/}
            {/*  color='primary'*/}
            {/*  endContent={<FiSave />}*/}
            {/*  size='sm'*/}
            {/*  onClick={() => onUpdateTripSections()}*/}
            {/*  className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'*/}
            {/*>*/}
            {/*  Save trip*/}
            {/*</Button>*/}
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total {sectionsToDisplay.length} sections
          </span>
        </div>
      </div>
    ),
    [statusFilter, visibleColumns, sectionsToDisplay.length]
  )

  const renderCell = (columnKey: Key, section: Section): CellElement => {
    // assertion is here because of types of the function 'getKeyValue'
    const cellValue = getKeyValue(section, columnKey as string | number)

    if (columnKey === 'type') {
      return (
        <TypeCell
          type={
            section.serviceProvider?.type ??
            section.transportType ??
            section.placementType ??
            section.type ??
            ''
          }
          onUpdate={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'name') {
      return (
        <NameCell
          name={section?.name ?? ''}
          onUpdate={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'status') {
      return (
        <StatusCell
          status={cellValue || DEFAULT_SECTION_STATUS}
          onUpdate={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'serviceProvider') {
      return (
        <ServiceProviderCell
          serviceProvider={section.serviceProvider}
          onUpdate={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'startingPoint' || columnKey === 'endPoint') {
      return (
        <TripPointCell
          data={section.startingPoint ?? fakeStartPoint}
          onUpdate={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'payments') {
      return (
        <PriceCell
          data={section.payments}
          onSave={(newValue) =>
            onSaveTableCell(newValue, section.id, columnKey)
          }
        />
      )
    }
    if (columnKey === 'duration') {
      return (
        <DurationCell
          dateTimeEnd={section.dateTimeEnd}
          dateTimeStart={section.dateTimeStart}
        />
      )
    }
    if (columnKey === 'note') {
      return (
        <NoteCell
          noteId={section.note as string}
          sectionId={section.id}
          onClick={() => {
            setCurrentSection(
              sectionsToDisplay.find((item) => item.id === section.id) ?? null
            )
          }}
        />
      )
    }
    if (columnKey === 'actions') {
      return (
        <div className='relative flex justify-end items-center gap-2'>
          <Dropdown className='bg-background border-1 border-default-200'>
            <DropdownTrigger>
              <Button isIconOnly radius='full' size='sm' variant='light'>
                <FiMoreVertical className='text-default-400' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>View</DropdownItem>
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }

    return getKeyValue(section, columnKey as string | number)
  }

  return (
    <>
      <div className='table-wrapper'>
        <div className='table'>
          <div className='thead'>
            {columns.map((column) => (
              <div
                key={column.uid}
                className='th'
                style={{ width: `${column.width}px` }}
              >
                <span>{column.name}</span>
              </div>
            ))}
          </div>
          <div className='tbody'>
            {sectionsToDisplay.map((section, index) => (
              <div key={index} className='tr'>
                {columns.map((column) => (
                  <div
                    key={column.uid + section.name}
                    className='td'
                    style={{ width: `${column.width}px` }}
                  >
                    {renderCell(column.uid, section)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <NotesDrawer section={currentSection} />
    </>
  )
}

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
  getKeyValue,
} from '@nextui-org/react'
import { FiPlus, FiMoreVertical, FiChevronDown } from 'react-icons/fi'
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
  statusOptionsMap,
} from './trip-table.config'
import { Key, useCallback, useEffect, useMemo, useState } from 'react'
import { capitalize, createNewSection } from '@/lib/utils'
import { Section, SectionBE } from '@/types/models'
import { ServiceProviderCell } from '@/components/templates/one-trip-page/cells/ServiceProviderCell'
import { StatusCell } from '@/components/templates/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { PriceCell } from '@/components/templates/one-trip-page/cells/PriceCell'
import { DurationCell } from '@/components/templates/one-trip-page/cells/DurationCell'
import { NoteCell } from '@/components/templates/one-trip-page/cells/NoteCell'
import { NameCell } from '@/components/templates/one-trip-page/cells/NameCell'
import { toast } from 'react-toastify'
import { CellElement } from '@react-types/table'
import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSection } from '@/apiRequests/apiDB'
import { useParams } from 'next/navigation'
import { TripPointCell } from '@/components/templates/one-trip-page/cells/TripPointCell'
import { fakeStartPoint } from '@/constants/defaultEntities'

const statusOptions = Object.entries(statusOptionsMap).map(([uid, name]) => ({
  uid,
  name,
}))

const sortingDefault = {
  // column: 'name',
  // direction: 'ascending',
}

// Section fields thad may be updated directly as one field has one string value
const simpleTableCells = [
  'name',
  'status',
  'dateTimeStart',
  'dateTimeEnd',
  'serviceProvider',
]

interface OneTripTableProps {
  sections: SectionBE[]
  // onUpdateTripSections: (sections: Section[]) => void
}

export const OneTripTable = ({
  sections,
  // onUpdateTripSections,
}: OneTripTableProps) => {
  const queryClient = useQueryClient()
  const { id: tripId } = useParams()
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  // const [sortDescriptor, setSortDescriptor] =
  //   useState<SortDescriptor>(sortingDefault)
  const [sectionsToDisplay, setSectionsToDisplay] = useState<Section[]>([])

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  useEffect(() => {
    setSectionsToDisplay(
      sections.map((section) => ({ ...section, id: section._id ?? '' }))
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

  // const filteredItems = useMemo(() => {
  //   let filteredUsers = [...sectionsToDisplay]
  //
  //   if (hasSearchFilter) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       (user?.name ?? '').toLowerCase().includes(filterValue.toLowerCase())
  //     )
  //   }
  //   if (
  //     statusFilter !== 'all' &&
  //     Array.from(statusFilter).length !== statusOptions.length
  //   ) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       Array.from(statusFilter).includes(user?.status ?? '')
  //     )
  //   }
  //
  //   return filteredUsers
  // }, [sectionsToDisplay, filterValue, statusFilter])

  // const sortedItems = useMemo(
  //   () =>
  //     [...filteredItems].sort((a: Section, b: Section) => {
  //       const first = a[
  //         sortDescriptor.column as keyof Section
  //       ] as unknown as number
  //       const second = b[
  //         sortDescriptor.column as keyof Section
  //       ] as unknown as number
  //       const cmp = first < second ? -1 : first > second ? 1 : 0
  //
  //       return sortDescriptor.direction === 'descending' ? -cmp : cmp
  //     }),
  //   [sortDescriptor, filteredItems]
  // )

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

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

  const renderCell = (columnKey: Key, section: Section): CellElement => {
    // assertion is here because of types of the function 'getKeyValue'
    const cellValue = getKeyValue(section, columnKey as string | number)

    if (columnKey === 'name') {
      return (
        <TableCell>
          <NameCell
            name={section?.name ?? ''}
            onUpdate={(newValue) =>
              onSaveTableCell(newValue, section.id, columnKey)
            }
          />
        </TableCell>
      )
    }
    if (columnKey === 'status') {
      return (
        <TableCell>
          <StatusCell
            status={cellValue || DEFAULT_SECTION_STATUS}
            onUpdate={(newValue) =>
              onSaveTableCell(newValue, section.id, columnKey)
            }
          />
        </TableCell>
      )
    }
    if (columnKey === 'serviceProvider') {
      return (
        <TableCell>
          <ServiceProviderCell
            serviceProvider={section.serviceProvider}
            onUpdate={(newValue) =>
              onSaveTableCell(newValue, section.id, columnKey)
            }
          />
        </TableCell>
      )
    }
    if (columnKey === 'startingPoint' || columnKey === 'endPoint') {
      return (
        <TableCell>
          <TripPointCell
            data={section.startingPoint ?? fakeStartPoint}
            onUpdate={(newValue) =>
              onSaveTableCell(newValue, section.id, columnKey)
            }
          />
        </TableCell>
      )
    }
    if (columnKey === 'price') {
      return (
        <TableCell>
          <PriceCell
            data={section.payments}
            onEditClick={() =>
              onSaveTableCell('newValue', section.id, columnKey)
            }
          />
        </TableCell>
      )
    }
    if (columnKey === 'duration') {
      return (
        <TableCell>
          <DurationCell
            dateTimeStart={section.dateTimeStart}
            dateTimeEnd={section.dateTimeEnd}
          />
        </TableCell>
      )
    }
    if (columnKey === 'note') {
      return (
        <TableCell>
          <NoteCell noteId={section.note as string} sectionId={section.id} />
        </TableCell>
      )
    }
    if (columnKey === 'actions') {
      return (
        <TableCell>
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
        </TableCell>
      )
    }
    return (
      <TableCell>
        {getKeyValue(section, columnKey as string | number)}
      </TableCell>
    )
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
    [
      filterValue,
      statusFilter,
      visibleColumns,
      onSearchChange,
      sectionsToDisplay.length,
      hasSearchFilter,
    ]
  )

  return (
    <>
      <Table
        isCompact
        // removeWrapper
        aria-label='Table with trip sections'
        className='trip-table'
        topContent={topContent}
        topContentPlacement='outside'
        // sortDescriptor={sortDescriptor}
        // onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {sectionsToDisplay.map((section) => (
            <TableRow key={section.id}>
              {(columnKey) => renderCell(columnKey, section)}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <NotesDrawer section={sectionsToDisplay[0]} />
    </>
  )
}

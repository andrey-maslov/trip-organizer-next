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
import { ApproachCell } from '@/components/templates/one-trip-page/cells/ApproachCell'
import { StatusCell } from '@/components/templates/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS, statusTypesList } from '@/constants/constants'
import { DateTimeCell } from '@/components/templates/one-trip-page/cells/DateTimeCell'
import { PriceCell } from '@/components/templates/one-trip-page/cells/PriceCell'
import { DurationCell } from '@/components/templates/one-trip-page/cells/DurationCell'
import { NotesCell } from '@/components/templates/one-trip-page/cells/NotesCell'
import { NameCell } from '@/components/templates/one-trip-page/cells/NameCell'
import { toast } from 'react-toastify'
import { CellElement } from '@react-types/table'

const statusOptions = Object.entries(statusOptionsMap).map(([uid, name]) => ({
  uid,
  name,
}))

const sortingDefault = {
  // column: 'name',
  // direction: 'ascending',
}

interface OneTripTableProps {
  sections: SectionBE[]
  onUpdateTripSections: (sections: Section[]) => void
}

export const OneTripTable = ({
  sections,
  onUpdateTripSections,
}: OneTripTableProps) => {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] =
    useState<SortDescriptor>(sortingDefault)
  const [sectionsToDisplay, setSectionsToDisplay] = useState<Section[]>(
    sections.map((section) => ({ ...section, id: section._id ?? '' }))
  )

  const [refresh, setRefresh] = useState(false)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...sectionsToDisplay]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user?.name ?? '').toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user?.status ?? '')
      )
    }

    return filteredUsers
  }, [sectionsToDisplay, filterValue, statusFilter])

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

  // TODO full realization - above. This is fake
  const sortedItems = [...filteredItems]

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  // const onEditCell = useCallback((columnKey: Key) => {
  //   console.log(columnKey)
  // }, [])

  const onSaveSectionField = (
    newValue: any,
    sectionId: string,
    columnKey: keyof Section
  ) => {
    const newSections = [...sectionsToDisplay]

    newSections.forEach((section) => {
      if (section.id === sectionId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        section[columnKey] = newValue
      }
    })

    // Applying filter we remove new sections created on FE without name
    const newSectionsSignificant = newSections.filter(
      (section) => section.name && section.name?.length > 0
    )

    onUpdateTripSections(newSectionsSignificant)
  }

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [refresh])

  const onAddNewSection = () => {
    setSectionsToDisplay((prevSections) => [
      ...prevSections,
      createNewSection(prevSections.length),
    ])
    toast.success('Section added', {
      position: 'top-center',
    })
  }

  const renderCell = useCallback(
    (columnKey: Key, section: Section): CellElement => {
      const cellValue = getKeyValue(section, columnKey)

      if (columnKey === 'name') {
        console.log('name-2')
        return (
          <TableCell>
            <NameCell
              name={section?.name ?? ''}
              onUpdate={(newValue) =>
                onSaveSectionField(newValue, section.id, 'name')
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
                onSaveSectionField(newValue, section.id, 'status')
              }
            />
          </TableCell>
        )
      }
      if (columnKey === 'transportType') {
        return (
          <TableCell>
            <ApproachCell
              data={section}
              onEditClick={() =>
                onSaveSectionField('newValue', section.id, 'status')
              }
            />
          </TableCell>
        )
      }
      if (columnKey === 'dateTimeStart' || columnKey === 'dateTimeEnd') {
        return (
          <TableCell>
            <DateTimeCell
              dateTime={section.dateTimeStart}
              onEditClick={() =>
                onSaveSectionField('newValue', section.id, 'status')
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
                onSaveSectionField('newValue', section.id, 'status')
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
            <NotesCell section={section} />
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
      return <TableCell>{getKeyValue(section, columnKey)}</TableCell>
    },
    []
  )

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
        // sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement='outside'
        // onSortChange={setSortDescriptor}
      >
        {/*<TableHeader>*/}
        {/*  {columns.map((column) => (*/}
        {/*    <TableColumn key={column.uid}>{column.name}</TableColumn>*/}
        {/*  ))}*/}
        {/*</TableHeader>*/}

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
    </>
  )
}

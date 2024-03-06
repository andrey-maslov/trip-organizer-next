import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
} from '@nextui-org/react'
import { FiPlus, FiMoreVertical, FiSearch, FiChevronDown } from 'react-icons/fi'
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
  statusOptionsMap,
} from './trip-table.config'
import { Key, ReactNode, useCallback, useMemo, useState } from 'react'
import { capitalize } from '@/lib/utils'
import { Section } from '@/types/models'
import { ApproachCell } from '@/components/templates/one-trip-page/cells/ApproachCell'
import { StatusCell } from '@/components/templates/one-trip-page/cells/StatusCell'
import { statusTypesList } from '@/constants/constants'
import { DateTimeCell } from '@/components/templates/one-trip-page/cells/DateTimeCell'
import { PriceCell } from '@/components/templates/one-trip-page/cells/PriceCell'
import { DurationCell } from '@/components/templates/one-trip-page/cells/DurationCell'
import { NotesCell } from '@/components/templates/one-trip-page/cells/NotesCell'
import { NameCell } from '@/components/templates/one-trip-page/cells/NameCell'

const statusOptions = Object.entries(statusOptionsMap).map(([uid, name]) => ({
  uid,
  name,
}))

const sortingDefault = {
  // column: 'name',
  // direction: 'ascending',
}

export const OneTripTable = ({ sections }: { sections: Section[] }) => {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] =
    useState<SortDescriptor>(sortingDefault)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...sections]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      )
    }

    return filteredUsers
  }, [sections, filterValue, statusFilter])

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: Section, b: Section) => {
        const first = a[
          sortDescriptor.column as keyof Section
        ] as unknown as number
        const second = b[
          sortDescriptor.column as keyof Section
        ] as unknown as number
        const cmp = first < second ? -1 : first > second ? 1 : 0

        return sortDescriptor.direction === 'descending' ? -cmp : cmp
      }),
    [sortDescriptor, filteredItems]
  )

  const renderCell = useCallback(
    (section: Section, columnKey: Key): ReactNode => {
      const cellValue = section[columnKey as keyof Section]

      if (columnKey === 'name') {
        return (
          <NameCell
            name={section.name}
            onEditClick={() => onEditCell(columnKey)}
          />
        )
      }
      if (columnKey === 'status') {
        return (
          <StatusCell
            status={cellValue?.toString() || statusTypesList[0]}
            onEditClick={() => onEditCell(columnKey)}
          />
        )
      }
      if (columnKey === 'transportType') {
        return (
          <ApproachCell
            data={section}
            onEditClick={() => onEditCell(columnKey)}
          />
        )
      }
      if (columnKey === 'dateTimeStart' || columnKey === 'dateTimeEnd') {
        return (
          <DateTimeCell
            dateTime={section.dateTimeStart}
            onEditClick={() => onEditCell(columnKey)}
          />
        )
      }
      if (columnKey === 'price') {
        return (
          <PriceCell
            data={section.payments}
            onEditClick={() => onEditCell(columnKey)}
          />
        )
      }
      if (columnKey === 'duration') {
        return (
          <DurationCell
            dateTimeStart={section.dateTimeStart}
            dateTimeEnd={section.dateTimeEnd}
          />
        )
      }

      if (columnKey === 'notes') {
        return <NotesCell data={section.notes} />
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
      return cellValue?.toString()
    },
    []
  )

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  const onEditCell = useCallback((columnKey: Key) => {
    console.log(columnKey)
  }, [])

  const topContent = useMemo(
    () => (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder='Search by name...'
            size='sm'
            startContent={<FiSearch className='text-default-300' />}
            value={filterValue}
            variant='bordered'
            onClear={() => setFilterValue('')}
            onValueChange={onSearchChange}
          />
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
              className='bg-foreground text-background'
              endContent={<FiPlus />}
              size='sm'
            >
              Add New
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total {sections.length} sections
          </span>
        </div>
      </div>
    ),
    [
      filterValue,
      statusFilter,
      visibleColumns,
      onSearchChange,
      sections.length,
      hasSearchFilter,
    ]
  )

  return (
    <>
      <h1 className='text-foreground'>TESE</h1>
      <Table
        isCompact
        removeWrapper
        aria-label='Table with trip sections'
        className='trip-table'
        // bottomContent={bottomContent}
        bottomContentPlacement='outside'
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement='outside'
        onSortChange={setSortDescriptor}
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
        <TableBody emptyContent={'No users found'} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

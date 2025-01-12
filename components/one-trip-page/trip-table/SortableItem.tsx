import type { CSSProperties, PropsWithChildren } from 'react'
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core'

import React, { createContext, useContext, useMemo } from 'react'
import { MdDragIndicator } from 'react-icons/md'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  id: UniqueIdentifier
}

interface Context {
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  ref(node: HTMLElement | null): void
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
})

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id })
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  )
  const style: CSSProperties = {
    zIndex: isDragging ? 100 : 1,
    boxShadow: isDragging
      ? 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px'
      : undefined,
    backgroundColor: isDragging ? 'rgb(250, 250, 250)' : '#fff',
    transform: CSS.Translate.toString(transform),
    transition,
  }

  console.log(context)

  return (
    <SortableItemContext.Provider value={context}>
      <div ref={setNodeRef} className='relative' style={style}>
        {children}
        <DragHandle />
      </div>
    </SortableItemContext.Provider>
  )
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext)

  return (
    <button
      {...attributes}
      {...listeners}
      ref={ref}
      className='absolute -left-3 z-10 top-[50%] -translate-y-5 bg-neutral-50 py-3 px-1 shadow-md text-center rounded-md'
    >
      <MdDragIndicator />
    </button>
  )
}

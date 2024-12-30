import type { PropsWithChildren } from 'react'
import type { DropAnimation } from '@dnd-kit/core'

import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
}

interface Props {}

export const SortableOverlay = ({ children }: PropsWithChildren<Props>) => {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  )
}

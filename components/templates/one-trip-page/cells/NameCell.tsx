import clsx from 'clsx'

import { Editable } from '@/components/Editable'
import { defaultSection } from '@/constants/defaultEntities'

type NameCellProps = {
  name: string
  onUpdate: (value: string) => void
}

const placeholder = 'Enter section name'

export const NameCell: React.FC<NameCellProps> = ({ name, onUpdate }) => (
  <div className='flex items-center relative editable-elemenet min-w-[170px] font-bold'>
    <Editable
      className={clsx(
        'text-nowrap',
        name === defaultSection.name ? 'text-foreground-400' : ''
      )}
      content={name || placeholder}
      setContent={onUpdate}
    />
  </div>
)

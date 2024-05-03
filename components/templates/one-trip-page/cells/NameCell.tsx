import clsx from 'clsx'
import { Editable } from '@/components/Editable'

type NameCellProps = {
  name: string
  onUpdate: (value: string) => void
}

const placeholder = 'Enter section name'

export const NameCell: React.FC<NameCellProps> = ({ name, onUpdate }) => (
  <div className='flex items-center relative editable-elemenet min-w-[170px]'>
    <Editable
      content={name || placeholder}
      className={clsx('text-nowrap', name ? '' : 'text-foreground-400')}
      setContent={onUpdate}
    />
  </div>
)

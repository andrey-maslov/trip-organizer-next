import { ButtonEdit } from '@/components/ButtonEdit'

type NameCellProps = {
  name: string | null
  onEditClick: () => void
}

export const NameCell: React.FC<NameCellProps> = ({ name, onEditClick }) => (
  <div className='flex items-center relative cell-editable'>
    <div className='text-nowrap'>{name ?? 'Enter section name'}</div>
    <ButtonEdit onClick={() => onEditClick()} />
  </div>
)

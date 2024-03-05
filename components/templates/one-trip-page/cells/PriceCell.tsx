import { ButtonEdit } from '@/components/ButtonEdit'
import { Payment } from '@/types/models'
import { getTotalPriceFromSection } from '@/lib/utils'

type PriceCellProps = {
  data: Payment[] | null
  onEditClick: () => void
}

export const PriceCell: React.FC<PriceCellProps> = ({ data, onEditClick }) => (
  <div className='flex items-center relative cell-editable'>
    <div className='text-nowrap'>{getTotalPriceFromSection(data)}</div>
    <ButtonEdit onClick={() => onEditClick()} />
  </div>
)

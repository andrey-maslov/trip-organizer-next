import { ButtonEdit } from '@/components/ButtonEdit'
import { Payment } from '@/types/models'
import { getTotalPriceFromSection } from '@/lib/utils'

type PriceCellProps = {
  data: Payment[] | null | undefined
  onEditClick: () => void
}

export const PriceCell: React.FC<PriceCellProps> = ({ data, onEditClick }) => (
  <div className='flex items-center relative editable-elemenet'>
    <div className='text-nowrap'>{getTotalPriceFromSection(data)}</div>
    <ButtonEdit onClick={() => onEditClick()} />
  </div>
)

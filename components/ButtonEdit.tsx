import { Button } from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

type ButtonEditProps = {
  onClick?: () => void
}

export const ButtonEdit = ({ onClick }: ButtonEditProps) => (
  <Button
    isIconOnly
    size='sm'
    color='warning'
    variant='faded'
    aria-label='edit'
    onClick={onClick}
    className='btn-edit'
  >
    <FiEdit2 />
  </Button>
)

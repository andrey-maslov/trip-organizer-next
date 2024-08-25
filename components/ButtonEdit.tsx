import { Button } from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

type ButtonEditProps = {
  onClick?: () => void
}

export const ButtonEdit = ({ onClick }: ButtonEditProps) => (
  <Button
    isIconOnly
    aria-label='edit'
    className='btn-edit'
    color='warning'
    size='sm'
    variant='faded'
    onPress={onClick}
  >
    <FiEdit2 />
  </Button>
)

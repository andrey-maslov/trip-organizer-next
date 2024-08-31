import { FiEdit2 } from 'react-icons/fi'

type ButtonEditProps = {
  onClick?: () => void
  classNames?: string
}

export const ButtonEdit = ({ onClick, classNames }: ButtonEditProps) => (
  <button
    className={`hover:bg-foreground-100 rounded-lg text-center p-2 ${classNames}`}
    title='edit address'
    onClick={onClick}
  >
    <FiEdit2 />
  </button>
)

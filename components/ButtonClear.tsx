import { FiDelete } from 'react-icons/fi'

type Props = {
  onClick?: () => void
  title?: string
  classNames?: string
}

export const ButtonClear = ({
  onClick,
  classNames,
  title = 'clear',
}: Props) => (
  <button
    className={`hover:bg-foreground-100 rounded-lg text-center p-2 ${classNames}`}
    title={title}
    onClick={onClick}
  >
    <FiDelete />
  </button>
)

// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'

type NotesProps = {
  data: string | null
  isOpen: boolean
  onClose: () => void
}

export const NotesDrawer: React.FC<NotesProps> = ({
  isOpen,
  data,
  onClose,
}) => (
  <Drawer
    open={isOpen}
    onClose={onClose}
    direction='right'
    className='notes-drawer'
    size={'50vw'}
  >
    <div>{data}</div>
  </Drawer>
)

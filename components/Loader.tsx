'use client'

import clsx from 'clsx'
import { CgSpinnerTwoAlt } from 'react-icons/cg'

type LoaderProps = {
  type?: string
  className?: string
}

const Loader: React.FC<LoaderProps> = ({ type, className }) => (
  <div className={clsx('flex justify-center align-middle', className)}>
    <CgSpinnerTwoAlt
      className='spinner text-primary'
      style={{ fontSize: '28px' }}
    />
  </div>
)

export default Loader

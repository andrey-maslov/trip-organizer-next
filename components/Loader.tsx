'use client'

import clsx from 'clsx'
import { Spinner } from "@heroui/spinner"
import React from 'react'

type LoaderProps = {
  type?: string
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({ className }) => (
  <div className={clsx('flex justify-center align-middle', className)}>
    {/*<CgSpinnerTwoAlt*/}
    {/*  className='spinner text-primary'*/}
    {/*  style={{ fontSize: '28px' }}*/}
    {/*/>*/}
    <Spinner color='warning' size='md' />
  </div>
)

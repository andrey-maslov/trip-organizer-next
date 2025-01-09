import { Select, SelectItem } from '@nextui-org/react'
import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { currencies, DEFAULT_CURRENCY } from '@/constants/constants'

export const CurrencySelect = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { slug } = useParams()

  const [currencyISO, setCurrencyISO] = useState(
    window.localStorage.getItem('app_currency_chosen') ?? DEFAULT_CURRENCY
  )

  const onChange = async (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrencyISO(evt.target.value as any)
    window.localStorage.setItem('app_currency_chosen', evt.target.value)

    await queryClient.invalidateQueries({
      queryKey: ['summary', slug, currencyISO],
    })
    router.refresh()
  }

  return (
    <div>
      <Select
        aria-label='currency'
        className='w-[100px]'
        defaultSelectedKeys={[currencyISO]}
        size='sm'
        onChange={onChange}
      >
        {Object.values(currencies).map((curr) => (
          <SelectItem key={curr.nameISO} value={curr.nameISO}>
            {curr.nameISO}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}

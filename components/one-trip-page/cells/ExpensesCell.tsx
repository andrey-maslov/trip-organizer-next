import { Button } from '@nextui-org/button'
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { convertAmount, getTotalPriceFromSection } from '@/lib/utils'
import { Expense } from '@/types/types'
import { DEFAULT_CURRENCY } from '@/constants/constants'
import { getOneTrip } from '@/queries/queries.db'
import { Loader } from '@/components/Loader'

type Props = {
  data: Expense[] | null | undefined
  onSave: (data: Partial<Expense>[]) => void
}

export const ExpensesCell: React.FC<Props> = ({ data, onSave }) => {
  const { slug } = useParams()

  const [isOpen, setOpen] = useState(false)
  const [expenses, setExpenses] = useState<Partial<Expense>[]>(data || [])

  // Fetch Trip
  const {
    isPending,
    error,
    data: trip,
  } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => getOneTrip(slug as string),
  })

  const onDataChange = (
    index: number,
    fieldName: keyof Expense,
    value: string | number
  ) => {
    const newExpenses = [...expenses]

    newExpenses[index] = { ...expenses[index], [fieldName]: value }
    setExpenses(newExpenses)
  }

  const convertedAmount = getTotalPriceFromSection(data, trip?.exchangeRates)
  const currenciesList = trip?.exchangeRates
    ? [trip?.exchangeRates.base, ...Object.keys(trip.exchangeRates.rates)]
    : []

  return (
    <div className='flex items-center relative editable-elemenet w-full'>
      <Button
        fullWidth
        color='default'
        size='sm'
        title={convertedAmount}
        variant='light'
        onPress={() => setOpen(true)}
      >
        {convertedAmount}
      </Button>

      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        size='md'
        onOpenChange={() => setOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add your expenses</ModalHeader>
              <ModalBody>
                <small className='mb-4'>
                  Add all your spending at this stage in a currency you are
                  comfortable with. The exchange rates will be recalculated to
                  your trip currency automatically
                </small>
                {isPending ? (
                  <Loader />
                ) : (
                  (expenses || []).map((payment, index) => (
                    <div key={index} className='flex gap-1 items-end mb-4'>
                      <Input
                        name={`name-${index}`}
                        placeholder='Expense name'
                        size='sm'
                        type='text'
                        value={payment.name}
                        variant='underlined'
                        onChange={(e) =>
                          onDataChange(index, 'name', e.target.value)
                        }
                      />
                      {/*<Input*/}
                      {/*  name={`link-${index}`}*/}
                      {/*  placeholder='Link to website'*/}
                      {/*  size='sm'*/}
                      {/*  type='text'*/}
                      {/*  value={payment.link}*/}
                      {/*  variant='underlined'*/}
                      {/*  onChange={(e) =>*/}
                      {/*    onDataChange(index, 'link', e.target.value)*/}
                      {/*  }*/}
                      {/*/>*/}
                      <Input
                        className='max-w-[150px]'
                        endContent={
                          <div className='flex items-center'>
                            {payment.amount &&
                              trip?.exchangeRates.base !== payment.currency && (
                                <small className='text-orange-500 absolute -top-[14px] right-2 flex gap-1'>
                                  <span className='font-semibold'>
                                    {convertAmount(
                                      payment.amount,
                                      payment.currency,
                                      trip?.exchangeRates
                                    )}
                                  </span>
                                  <span>{trip?.exchangeRates.base}</span>
                                </small>
                              )}
                            <label className='sr-only' htmlFor='currency'>
                              Currency
                            </label>
                            <select
                              className='outline-none border-0 bg-transparent text-default-400 text-small'
                              id='currency'
                              name={`currency-${index}`}
                              value={payment.currency}
                              onChange={(e) =>
                                onDataChange(index, 'currency', e.target.value)
                              }
                            >
                              {currenciesList.map((nameISO) => (
                                <option key={nameISO}>{nameISO}</option>
                              ))}
                            </select>
                          </div>
                        }
                        name={`amount-${index}`}
                        size='sm'
                        // startContent={
                        //   <div className='pointer-events-none flex items-center'>
                        //     <span className='text-default-400 text-small'>
                        //       {
                        //         currencies[
                        //           payment.currency ||
                        //             trip?.exchangeRates?.base ||
                        //             DEFAULT_CURRENCY
                        //         ].symbol
                        //       }
                        //     </span>
                        //   </div>
                        // }
                        type='number'
                        value={payment.amount?.toString()}
                        variant='underlined'
                        onChange={(e) =>
                          onDataChange(
                            index,
                            'amount',
                            Number.parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  ))
                )}

                <Button
                  isIconOnly
                  aria-label='Add expense'
                  color='default'
                  radius='full'
                  size='sm'
                  onPress={() => {
                    setExpenses((prev) => [
                      {
                        currency: trip?.exchangeRates?.base || DEFAULT_CURRENCY,
                        amount: 0,
                        name: '',
                        link: '',
                      },
                      ...prev,
                    ])
                  }}
                >
                  +
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    onSave(expenses)
                    onClose()
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

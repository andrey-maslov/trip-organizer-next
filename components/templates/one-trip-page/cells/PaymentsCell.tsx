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

import { getTotalPriceFromSection } from '@/lib/utils'
import { Payment } from '@/types/models'
import { currencies, DEFAULT_CURRENCY } from '@/constants/constants'

type Props = {
  data: Payment[] | null | undefined
  onSave: (data: Partial<Payment>[]) => void
}

const defaultExpense: Partial<Payment> = {
  currency: DEFAULT_CURRENCY,
  amount: 0,
  name: '',
  link: '',
}

const currenciesList = Object.values(currencies)

export const PaymentsCell: React.FC<Props> = ({ data, onSave }) => {
  const [isOpen, setOpen] = useState(false)
  const [expenses, setExpenses] = useState<Partial<Payment>[]>(
    data ?? [defaultExpense]
  )

  const onDataChange = (
    index: number,
    fieldName: keyof Payment,
    value: string | number
  ) => {
    const newExpenses = [...expenses]

    newExpenses[index] = { ...expenses[index], [fieldName]: value }
    setExpenses(newExpenses)
  }

  return (
    <div className='flex items-center relative editable-elemenet w-full'>
      <Button
        color='default'
        size='sm'
        variant='light'
        onPress={() => setOpen(true)}
      >
        {getTotalPriceFromSection(data)}
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
              <ModalHeader className='flex flex-col gap-1'>
                Add your expenses
              </ModalHeader>
              <ModalBody>
                {expenses.map((payment, index) => (
                  <div key={index} className='flex gap-1 items-end'>
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
                    <Input
                      name={`link-${index}`}
                      placeholder='Link to website'
                      size='sm'
                      type='text'
                      value={payment.link}
                      variant='underlined'
                      onChange={(e) =>
                        onDataChange(index, 'link', e.target.value)
                      }
                    />
                    <Input
                      endContent={
                        <div className='flex items-center'>
                          <label className='sr-only' htmlFor='currency'>
                            Currency
                          </label>
                          <select
                            className='outline-none border-0 bg-transparent text-default-400 text-small'
                            defaultValue={DEFAULT_CURRENCY}
                            id='currency'
                            name={`currency-${index}`}
                            value={payment.currency}
                            onChange={(e) =>
                              onDataChange(index, 'currency', e.target.value)
                            }
                          >
                            {currenciesList.map(({ nameISO }) => (
                              <option key={nameISO}>{nameISO}</option>
                            ))}
                          </select>
                        </div>
                      }
                      name={`amount-${index}`}
                      placeholder='0.00'
                      size='sm'
                      startContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>
                            {
                              currencies[payment.currency ?? DEFAULT_CURRENCY]
                                .symbol
                            }
                          </span>
                        </div>
                      }
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
                ))}

                <Button
                  isIconOnly
                  aria-label='Add expense'
                  color='default'
                  radius='full'
                  size='sm'
                  onPress={() => {
                    setExpenses((prev) => [defaultExpense, ...prev])
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

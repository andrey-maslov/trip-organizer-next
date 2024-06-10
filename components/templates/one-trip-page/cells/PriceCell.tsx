import { Payment } from '@/types/models'
import { getTotalPriceFromSection } from '@/lib/utils'
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
import { currencies, DEFAULT_CURRENCY } from '@/constants/constants'

type PriceCellProps = {
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

export const PriceCell: React.FC<PriceCellProps> = ({ data, onSave }) => {
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

  const saveExpenses = () => {
    onSave(expenses)
  }

  return (
    <div className='flex items-center relative editable-elemenet'>
      <Button
        color='default'
        size='sm'
        variant='light'
        onClick={() => setOpen(true)}
      >
        {getTotalPriceFromSection(data)}
      </Button>

      <Modal
        backdrop='opaque'
        size='md'
        isOpen={isOpen}
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
                  <div className='flex gap-1 items-end' key={index}>
                    <Input
                      name={`name-${index}`}
                      variant='underlined'
                      placeholder='Expense name'
                      size='sm'
                      type='text'
                      value={payment.name}
                      onChange={(e) =>
                        onDataChange(index, 'name', e.target.value)
                      }
                    />
                    <Input
                      name={`link-${index}`}
                      variant='underlined'
                      placeholder='Link to website'
                      size='sm'
                      type='text'
                      value={payment.link}
                      onChange={(e) =>
                        onDataChange(index, 'link', e.target.value)
                      }
                    />
                    <Input
                      size='sm'
                      name={`amount-${index}`}
                      variant='underlined'
                      placeholder='0.00'
                      value={payment.amount?.toString()}
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
                      endContent={
                        <div className='flex items-center'>
                          <label className='sr-only' htmlFor='currency'>
                            Currency
                          </label>
                          <select
                            className='outline-none border-0 bg-transparent text-default-400 text-small'
                            id='currency'
                            name={`currency-${index}`}
                            defaultValue={DEFAULT_CURRENCY}
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
                      type='number'
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
                  size='sm'
                  isIconOnly
                  color='default'
                  aria-label='Add expense'
                  radius='full'
                  onClick={() => {
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
                <Button color='primary' onPress={() => saveExpenses()}>
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

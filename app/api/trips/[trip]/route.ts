import { isValidObjectId, Types } from 'mongoose'
import { auth } from '@clerk/nextjs/server'

import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'
import { ExchangeRates, Expense } from '@/types/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trip: string }> }
) {
  const slug = (await params).trip

  await connectMongo()

  // Get one trip
  try {
    const trip = await TripSchema.findOne({
      $or: [
        {
          _id: isValidObjectId(slug) ? new Types.ObjectId(slug) : undefined,
        },
        { slug },
      ],
    }).lean()

    return Response.json(trip)
  } catch (e) {
    return new Response('Get all error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongo()

  const payload = await request.json()

  // temp solution
  payload.user = userId

  // Update one trip
  try {
    const trip = await TripSchema.findByIdAndUpdate(payload._id, payload, {
      new: true,
    }).lean()

    // const totalExpense = getTotalExpense(trip.pay)

    return Response.json({ ...trip })
  } catch (e) {
    return new Response('Update trip error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

function getTotalExpense(
  expenses: Expense[],
  currency: string,
  exchangeRates: ExchangeRates
) {
  if (!exchangeRates[currency as keyof ExchangeRates]) {
    throw new Error(`Currency rate ${currency} not found.`)
  }

  return expenses.reduce((total, expense) => {
    const { amount, currency: expenseCurrency } = expense

    // Пропускаем записи, у которых amount или currency отсутствуют
    if (amount === undefined || expenseCurrency === undefined) {
      return total
    }

    if (expenseCurrency === currency) {
      return total + amount
    }

    const conversionRate =
      // @ts-ignore
      exchangeRates[expenseCurrency as keyof ExchangeRates]?.rates[currency]

    if (!conversionRate) {
      throw new Error(
        `Conversion from ${expenseCurrency} to ${currency} impossible.`
      )
    }

    return total + amount * conversionRate
  }, 0)
}

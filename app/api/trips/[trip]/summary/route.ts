import { isValidObjectId, Types } from 'mongoose'
import { NextRequest } from 'next/server'

import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'
import { getTripSummaryValues } from '@/services/TripSummaryService'
import { Trip } from '@/types/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { trip: string } }
) {
  const { trip: slug } = params
  const searchParams = request.nextUrl.searchParams
  const currencyISO = searchParams.get('currency')

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

    const summary = await getTripSummaryValues(
      trip as Trip,
      currencyISO as string
    )

    return Response.json(summary)
  } catch (e) {
    return new Response('Get all error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

import { isValidObjectId, Types } from 'mongoose'
import { NextRequest } from 'next/server'

import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'
import { getTripSummaryValues } from '@/services/TripSummaryService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trip: string }> }
) {
  const slug = (await params).trip
  const searchParams = request.nextUrl.searchParams
  const currencyISO = searchParams.get('currency')

  await connectMongo()

  // Get one trip
  try {
    const trip: any = await TripSchema.findOne({
      $or: [
        {
          _id: isValidObjectId(slug) ? new Types.ObjectId(slug) : undefined,
        },
        { slug },
      ],
    }).lean()

    const summary = getTripSummaryValues(trip, currencyISO as string)

    return Response.json(summary)
  } catch (e) {
    return new Response('Get summary failed', {
      // TODO add 500 and 404 separation
      status: 500,
    })
  }
}

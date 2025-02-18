import { isValidObjectId, Types } from 'mongoose'
import { auth } from '@clerk/nextjs/server'

import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'

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
    return new Response('Get trips error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

export async function PUT(request: Request) {
  const { sessionClaims } = await auth()
  const mongoId = sessionClaims?.externalId

  if (!mongoId) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongo()

  const payload = await request.json()

  // temp solution
  payload.userId = mongoId

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

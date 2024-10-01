import { auth } from '@clerk/nextjs/server'

import connectMongo from '@/lib/db/connectMongo'
import TripSchema from '@/lib/db/schemas/Trip.schema'
import { Trip } from '@/types/types'

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongo()

  // Get many trips
  try {
    const filter = { user: userId }
    // const filter = {}
    const trips = await TripSchema.find(filter).lean()

    return Response.json({ trips })
  } catch (e) {
    console.log(e)

    return new Response('Get all error', {
      status: 500,
    })
  }
}

// Create new trip
export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongo()

  try {
    const data = await request.json()
    const newTrip: Trip = await TripSchema.create({ ...data, user: userId })

    return Response.json({ id: newTrip._id, slug: newTrip.slug })
  } catch (error: any) {
    return new Response(`error!!!: ${error?.message}`, {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongo()

  try {
    const payload = await request.json()

    await TripSchema.deleteOne({ slug: payload.id })

    return new Response('deleted', {
      status: 200,
    })
  } catch (e) {
    return new Response('Get all error', {
      status: 500,
    })
  }
}

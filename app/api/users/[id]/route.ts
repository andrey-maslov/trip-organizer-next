import { NextRequest } from 'next/server'

import connectMongo from '@/lib/db/connectMongo'
import UserSchema from '@/lib/db/schemas/User.schema'

// get one user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongo()

  try {
    const user = await UserSchema.findById(params.id).lean()

    return Response.json(user)
  } catch (e) {
    return new Response('Get user failure', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

// Update one user
export async function PUT(request: Request) {
  const payload = await request.json()

  await connectMongo()

  try {
    const user = await UserSchema.findByIdAndUpdate(payload._id, payload, {
      new: true,
    }).lean()

    return Response.json({ ...user })
  } catch (e) {
    return new Response('Update user failure', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

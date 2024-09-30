import { NextRequest } from 'next/server'

import connectMongo from '@/lib/db/connectMongo'
import UserSchema from '@/lib/db/schemas/User.schema'
import { UserData } from '@/types/types'

// Get users
export async function GET(req: NextRequest) {
  await connectMongo()

  // get one user by user ID from Token (for user account page)
  try {
    const user = await UserSchema.findById('token.userId').lean()

    return Response.json(user)
  } catch (e) {
    return new Response('Get user failure', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }

  // get all users
  // try {
  //   const users = await UserSchema.find().lean();
  //
  //   return Response.json({ users });
  // } catch (e) {
  //   return new Response(`Get users failure`, {
  //     status: 500,
  //   });
  // }
}

// Create new user
export async function POST(request: Request) {
  await connectMongo()

  try {
    const data = await request.json()
    const newUser: UserData = await UserSchema.create(data)

    // return Response.json({ id: newUser._id });
    return Response.json(newUser)
  } catch (error: any) {
    return new Response(`Create user failure: ${error?.message}`, {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  await connectMongo()

  try {
    const payload = await request.json()

    await UserSchema.deleteOne({ _id: payload.id })

    return new Response('deleted', {
      status: 200,
    })
  } catch (e) {
    return new Response('Delete user failure', {
      status: 500,
    })
  }
}

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import connectMongo from '@/lib/db/connectMongo'
import UserModel from '@/lib/db/schemas/User.schema'
import { Role, UserDB } from '@/types/user.types'

export async function POST(req: Request) {
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  await connectMongo()

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const clerk = await clerkClient()

  switch (event.type) {
    case 'user.created': {
      const {
        id,
        public_metadata,
        email_addresses,
        first_name,
        last_name,
        image_url,
        updated_at,
        created_at,
      } = event.data

      // To save in MongoDB
      const newUser: UserDB = {
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        roles: (public_metadata?.roles ?? ['user']) as Role[],
        createdAt: created_at,
        updatedAt: updated_at,
      }

      let mongoUserId = ''

      try {
        const userCreated = await UserModel.create(newUser)
        mongoUserId = userCreated._id

        await clerk.users.updateUser(id, {
          publicMetadata: {
            roles: ['user'],
          },
          externalId: mongoUserId,
        })
      } catch (error) {
        console.error('Error saving user to MongoDB:', error)
      }

      break
    }

    case 'user.updated': {
      const {
        id,
        public_metadata,
        email_addresses,
        first_name,
        last_name,
        image_url,
        updated_at,
        created_at,
      } = event.data

      // Transform to milliseconds
      const createdTime = new Date(created_at).getTime()
      const updatedTime = new Date(updated_at).getTime()

      // If diff < 2 sec (2000ms) skip sync
      // TODO check it
      const checkTimeDiff = 2000 // 2 sec
      if (updatedTime - createdTime < checkTimeDiff) {
        console.log(
          `Skipping redundant update event for user ${id} (time diff < ${checkTimeDiff}ms)`
        )
        break
      }

      // Update in MongoDB
      const updatedUser: UserDB = {
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        roles: (public_metadata?.roles ?? ['user']) as Role[],
        createdAt: created_at,
        updatedAt: updated_at,
      }

      try {
        await UserModel.findOneAndUpdate({ clerkId: id }, updatedUser, {
          new: true,
          upsert: true,
        })
        console.log(`User ${id} updated in MongoDB`)
      } catch (error) {
        console.error('Error updating user in MongoDB:', error)
      }
      break
    }

    case 'user.deleted': {
      const { id } = event.data

      try {
        await UserModel.findOneAndDelete({ clerkId: id })
        console.log(`User ${id} deleted from MongoDB`)
      } catch (error) {
        console.error('Error deleting user from MongoDB:', error)
      }
      break
    }
  }

  return new Response('done', { status: 200 })
}

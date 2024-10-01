import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import UserSchema from '@/lib/db/schemas/User.schema'
import { UserDB } from '@/types/types'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)

    return new Response('Error occured', {
      status: 400,
    })
  }

  // Create user
  if (evt.type === 'user.created') {
    try {
      const user: UserDB = {
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        email: evt.data.email_addresses[0]?.email_address,
        userClerkId: evt.data.id,
        role: 'user',
      }

      await UserSchema.create(user)

      // if (!evt.data.external_id) {
      //   await clerkClient.users.updateUser(evt.data.id, {
      //     externalId: newUser._id,
      //   })
      // }

      return new Response('Event: ' + evt.type + '; status: OK', {
        status: 200,
      })
    } catch (e) {
      console.log(e)

      return new Response('Webhook failed', { status: 500 })
    }
  }

  // update user
  if (evt.type === 'user.updated') {
    try {
      const user: UserDB = {
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        email: evt.data.email_addresses[0]?.email_address,
        role: 'user',
      }

      const filter = { userClerkId: evt.data.id }

      await UserSchema.findOneAndUpdate(filter, user, {
        new: true,
        upsert: true,
        useFindAndModify: false,
      })

      // if (!evt.data.external_id) {
      //   await clerkClient.users.updateUser(evt.data.id, {
      //     externalId: updatedUser._id,
      //   })
      // }

      return new Response('Event: ' + evt.type + '; status: OK', {
        status: 200,
      })
    } catch (e) {
      console.log(e)

      return new Response('Webhook failed', { status: 500 })
    }
  }

  // Delete user
  if (evt.type === 'user.deleted') {
    try {
      await UserSchema.deleteOne({ userClerkId: evt.data.id })

      console.log('Event: ' + evt.type + '; status: OK')

      return new Response('Deleted', {
        status: 200,
      })
    } catch (e) {
      console.log(e)

      return new Response('Webhook failed', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}

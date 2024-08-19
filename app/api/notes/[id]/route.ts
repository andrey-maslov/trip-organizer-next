import connectMongo from '@/lib/db/connectMongo'
import NoteSchema from '@/lib/db/schemas/Note.schema'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongo()

  // Get one Note
  try {
    const note = await NoteSchema.findById(params.id).lean()

    return Response.json(note)
  } catch (e) {
    return new Response('Get all error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

export async function PUT(request: Request) {
  const payload = await request.json()

  await connectMongo()

  // Update one trip
  try {
    const note = await NoteSchema.findByIdAndUpdate(payload._id, payload, {
      new: true,
    }).lean()

    return Response.json({ ...note })
  } catch (e) {
    return new Response('Update trip error', {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

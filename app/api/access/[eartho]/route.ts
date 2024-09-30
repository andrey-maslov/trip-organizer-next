import { handleAccess, handleConnect } from '@eartho/one-client-nextjs'

export const GET = handleAccess({
  login: handleConnect({
    authorizationParams: {
      access_id: process.env.EARTHO_ACCESS_POINT_LOGIN,
    },
  }),
  onError(req: Request, error: Error) {
    console.error(error)
  },
})

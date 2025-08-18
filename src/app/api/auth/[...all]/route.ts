import { auth } from '@/features/auth/server/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const { GET, POST } = toNextJsHandler(auth)

export { GET, POST }

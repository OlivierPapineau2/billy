import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Middleware function that runs on every request
// Handles session management and authentication
export async function middleware(request: NextRequest) {
  // Update user session and return the response
  return await updateSession(request)
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // Regex pattern: exclude static assets and image files from middleware processing
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

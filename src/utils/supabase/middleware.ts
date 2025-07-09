import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware function to handle Supabase authentication
 * Runs on every request to check if user is authenticated
 */
export async function updateSession(request: NextRequest) {
  // Create initial response that we'll modify based on auth status
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create Supabase client for server-side authentication
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Method to get all cookies from the response
        getAll() {
          return request.cookies.getAll()
        },
        // Method to set cookies on the request and update response
        setAll(cookiesToSet) {
          // Set cookies on the request object
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          // Create new response with updated cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          // Set cookies on the response object with options
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Get current user from Supabase using session stored in cookies
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is not authenticated and trying to access protected route
  if (
    !user &&
    !['/login', '/signup', '/error'].includes(request.nextUrl.pathname)
  ) {
    // Redirect unauthenticated users to login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Return response with authentication cookies if user is authenticated
  return supabaseResponse
}

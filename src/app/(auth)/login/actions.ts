'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // TODO: Add validation
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(data)

  console.log('user', user)

  if (error) {
    console.error('login error', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

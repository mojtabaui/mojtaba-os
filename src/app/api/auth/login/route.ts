import { NextResponse } from 'next/server'
import { CREDENTIALS, AUTH_COOKIE, VALID_TOKEN } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const res = NextResponse.json({ success: true })
      res.cookies.set(AUTH_COOKIE, VALID_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      return res
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}

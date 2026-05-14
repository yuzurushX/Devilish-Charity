import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Find admin user
    const { data: adminUsers, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, is_master_admin')
      .eq('username', username)

    if (fetchError || !adminUsers || adminUsers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const adminUser = adminUsers[0]

    // Check password
    const passwordMatch = await bcrypt.compare(password, adminUser.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create session token (simple JWT-like token)
    const token = Buffer.from(
      JSON.stringify({
        adminId: adminUser.id,
        username: adminUser.username,
        is_master_admin: adminUser.is_master_admin,
        timestamp: Date.now(),
      })
    ).toString('base64')

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
    })

    // Set secure session cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

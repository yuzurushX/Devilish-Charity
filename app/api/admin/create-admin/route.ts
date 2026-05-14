import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated via Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract token from Authorization header
    const token = authHeader.slice(7)

    // Decode token to get user info
    let sessionData: any
    try {
      sessionData = JSON.parse(Buffer.from(token, 'base64').toString())
    } catch (e) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is master admin
    if (!sessionData.is_master_admin) {
      return NextResponse.json(
        { error: 'Forbidden: Only master admins can create new admin accounts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Check if username already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)

    if (existingAdmin && existingAdmin.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new admin (non-master by default)
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username,
          password_hash: hashedPassword,
          is_master_admin: false,
        },
      ])
      .select('id, username, is_master_admin, created_at')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create admin account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: newAdmin?.[0],
    })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}

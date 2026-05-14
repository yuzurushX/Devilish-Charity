import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient()

    // Check if any admins exist
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check admin status' },
        { status: 500 }
      )
    }

    const adminExists = admins && admins.length > 0

    return NextResponse.json({
      success: true,
      adminExists,
      setupRequired: !adminExists,
    })
  } catch (error) {
    console.error('Setup check error:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient()

    // Check if any admins already exist
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json(
        { error: 'Failed to check admin status' },
        { status: 500 }
      )
    }

    // If admins already exist, deny setup
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Setup already completed. Admin accounts already exist.' },
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

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create first admin as master admin
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username,
          password_hash: hashedPassword,
          is_master_admin: true,
        },
      ])
      .select('id, username, is_master_admin, created_at')

    if (error) {
      console.error('Setup creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create admin account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Master admin account created successfully',
      admin: newAdmin?.[0],
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

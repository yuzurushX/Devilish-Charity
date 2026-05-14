import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated via Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Get all admins
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('id, username, is_master_admin, created_at')
      .order('is_master_admin', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch admin status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      admins: admins || [],
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin status' },
      { status: 500 }
    )
  }
}

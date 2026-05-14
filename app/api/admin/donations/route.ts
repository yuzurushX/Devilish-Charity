import { NextRequest, NextResponse } from 'next/server'
import { sendDiscordNotification } from '@/lib/discord-webhook'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Check if admin is authenticated via Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ donations: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if admin is authenticated via Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { donationId, status, adminUsername } = await request.json()

    if (!donationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('donations')
      .update({
        status,
        action_by: adminUsername || 'admin',
        action_at: new Date().toISOString(),
      })
      .eq('id', donationId)
      .select()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Failed to update donation' },
        { status: 500 }
      )
    }

    // Send Discord notification for donation status change
    const donation = data[0]
    const statusLabel = status === 'approved' ? '✅ Disetujui' : '❌ Ditolak'
    const color = status === 'approved' ? 65280 : 16711680 // Green or Red
    const donorDisplay = donation.is_anonymous ? 'Anonim' : donation.name
    const title = `${statusLabel} - Donasi dari ${donorDisplay}`

    await sendDiscordNotification(
      title,
      `Donasi telah ${status === 'approved' ? 'disetujui' : 'ditolak'} oleh admin.`,
      color,
      [
        { name: 'Nama Donatur', value: donorDisplay, inline: true },
        { name: 'Nominal', value: `Rp ${donation.amount.toLocaleString('id-ID')}`, inline: true },
        { name: 'Admin', value: adminUsername || 'N/A', inline: true },
        { name: 'Metode Pembayaran', value: donation.payment_method, inline: true },
        { name: 'Username Discord', value: donation.is_anonymous ? 'Anonim' : (donation.discord_username || 'Tidak ada'), inline: true },
        { name: 'Tipe Donasi', value: donation.is_anonymous ? '🔒 Anonim' : 'Terbuka', inline: true },
        { name: 'ID Donasi', value: donation.id, inline: false },
      ]
    )

    return NextResponse.json({
      success: true,
      donation: data[0],
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

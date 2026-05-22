import { NextRequest, NextResponse } from 'next/server'
import { sendDiscordNotification } from '@/lib/discord-webhook'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, discordUsername, amount, paymentMethod, proofUrl, message, isAnonymous } = body

    // Validate inputs
    if (!name || !amount || !paymentMethod || !proofUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Insert donation
    const { data, error } = await supabase
      .from('donations')
      .insert({
        name,
        discord_username: isAnonymous ? null : (discordUsername || null),
        amount,
        payment_method: paymentMethod,
        proof_url: proofUrl,
        message: message || null,
        is_anonymous: isAnonymous || false,
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create donation' },
        { status: 500 }
      )
    }

    // Send Discord notification for new pending donation
    const donation = data[0]
    const donorName = isAnonymous ? 'Anonim' : name
    await sendDiscordNotification(
      '💰 Donasi Baru Pending',
      `Donasi baru telah diterima dan menunggu verifikasi admin.`,
      16776960,
      [
        { name: 'Nama Donatur', value: donorName, inline: true },
        {
          name: 'Nominal',
          value: `Rp ${amount.toLocaleString('id-ID')}`,
          inline: true,
        },
        {
          name: 'Username Discord',
          value: isAnonymous
            ? 'Anonim'
            : (discordUsername || 'Tidak ada'),
          inline: true,
        },
        {
          name: 'Metode Pembayaran',
          value: paymentMethod,
          inline: true,
        },
        {
          name: 'Tipe',
          value: isAnonymous ? '🔒 Anonim' : 'Terbuka',
          inline: true,
        },
        {
          name: 'Pesan',
          value: message || 'Tidak ada',
          inline: false,
        },
        {
          name: 'ID Donasi',
          value: donation.id,
          inline: false,
        },
      ],
    
      // mention here
      '<@1419903183542681704> <@363345483634311180>'
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

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }

    // Filter anonymous donations to hide personal data in public view
    const filteredData = data.map(donation => ({
      ...donation,
      name: donation.is_anonymous ? 'Anonim' : donation.name,
      discord_username: donation.is_anonymous ? null : donation.discord_username,
    }))

    return NextResponse.json({ donations: filteredData })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

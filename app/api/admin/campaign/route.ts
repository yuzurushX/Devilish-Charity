import { NextRequest, NextResponse } from 'next/server'
import {
  defaultCampaignSettings,
  type CampaignStage,
  type DonationStatus,
} from '@/lib/campaign-types'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

const donationStatuses: DonationStatus[] = ['open', 'closed']
const progressStages: CampaignStage[] = [
  'open',
  'closed',
  'preparing',
  'distributed',
  'completed',
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('campaign_settings')
      .select('*')
      .eq('id', true)
      .maybeSingle()

    if (error) {
      console.error('Admin campaign fetch error:', error)
      return NextResponse.json({
        settings: defaultCampaignSettings,
        warning: 'Campaign settings table is not ready. Run scripts/05-add-campaign-settings.sql.',
      })
    }

    return NextResponse.json({
      settings: {
        ...defaultCampaignSettings,
        ...(data || {}),
      },
    })
  } catch (error) {
    console.error('Admin campaign API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      donation_status,
      campaign_title,
      target_amount,
      event_name,
      event_date,
      event_location,
      event_description,
      progress_stage,
      progress_note,
      adminUsername,
    } = body

    if (!donationStatuses.includes(donation_status)) {
      return NextResponse.json({ error: 'Invalid donation status' }, { status: 400 })
    }

    if (!progressStages.includes(progress_stage)) {
      return NextResponse.json({ error: 'Invalid progress stage' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()
    const payload = {
      id: true,
      donation_status,
      campaign_title: campaign_title?.trim() || 'Devilish Charity',
      target_amount: Math.max(0, Number(target_amount) || 0),
      event_name: event_name?.trim() || null,
      event_date: event_date?.trim() || null,
      event_location: event_location?.trim() || null,
      event_description: event_description?.trim() || null,
      progress_stage,
      progress_note: progress_note?.trim() || null,
      updated_at: new Date().toISOString(),
      updated_by: adminUsername || 'admin',
    }

    const { data, error } = await supabase
      .from('campaign_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Admin campaign update error:', error)
      return NextResponse.json(
        { error: 'Failed to update campaign settings. Run scripts/05-add-campaign-settings.sql first.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, settings: data })
  } catch (error) {
    console.error('Admin campaign update API error:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign settings' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import {
  defaultCampaignSettings,
  type CampaignSettings,
} from '@/lib/campaign-types'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

async function getDonationSummary() {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('donations')
    .select('amount, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Campaign donation summary error:', error)
    return {
      totalAmount: 0,
      totalDonors: 0,
      latestDonationAt: null,
    }
  }

  return {
    totalAmount: (data || []).reduce((sum, donation) => sum + donation.amount, 0),
    totalDonors: data?.length || 0,
    latestDonationAt: data?.[0]?.created_at || null,
  }
}

async function getExpenseSummary() {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('charity_expenses')
    .select('*')
    .order('spent_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Campaign expense summary error:', error)
    return {
      totalSpent: 0,
      expenses: [],
    }
  }

  return {
    totalSpent: (data || []).reduce((sum, expense) => sum + expense.amount, 0),
    expenses: data || [],
  }
}

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
      .from('campaign_settings')
      .select('*')
      .eq('id', true)
      .maybeSingle()

    if (error) {
      console.error('Campaign settings fetch error:', error)
    }

    const summary = await getDonationSummary()
    const expenseSummary = await getExpenseSummary()
    const settings = {
      ...defaultCampaignSettings,
      ...(data || {}),
    } as CampaignSettings

    return NextResponse.json({
      settings,
      ...summary,
      ...expenseSummary,
      remainingAmount: summary.totalAmount - expenseSummary.totalSpent,
    })
  } catch (error) {
    console.error('Campaign API error:', error)
    return NextResponse.json({
      settings: defaultCampaignSettings,
      totalAmount: 0,
      totalDonors: 0,
      totalSpent: 0,
      remainingAmount: 0,
      latestDonationAt: null,
      expenses: [],
    })
  }
}

'use client'

import { useEffect, useState } from 'react'
import {
  defaultCampaignSettings,
  type CampaignSummary,
} from '@/lib/campaign-types'

const initialSummary: CampaignSummary = {
  settings: defaultCampaignSettings,
  totalAmount: 0,
  totalDonors: 0,
  totalSpent: 0,
  remainingAmount: 0,
  expenseCount: 0,
  latestDonationAt: null,
  expenses: [],
}

const CACHE_TTL_MS = 15_000
const campaignCache = new Map<string, { data: CampaignSummary; expiresAt: number }>()
const campaignRequests = new Map<string, Promise<CampaignSummary>>()

async function loadCampaign(includeExpenses: boolean) {
  const cacheKey = includeExpenses ? 'with-expenses' : 'summary'
  const cached = campaignCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) return cached.data

  const existingRequest = campaignRequests.get(cacheKey)
  if (existingRequest) return existingRequest

  const request = fetch(`/api/campaign${includeExpenses ? '?includeExpenses=true' : ''}`)
    .then(async (response) => {
      if (!response.ok) return initialSummary

      const data = await response.json()
      const campaign = {
        settings: {
          ...defaultCampaignSettings,
          ...(data.settings || {}),
        },
        totalAmount: data.totalAmount || 0,
        totalDonors: data.totalDonors || 0,
        totalSpent: data.totalSpent || 0,
        remainingAmount: data.remainingAmount || 0,
        expenseCount: data.expenseCount || 0,
        latestDonationAt: data.latestDonationAt || null,
        expenses: data.expenses || [],
      }

      campaignCache.set(cacheKey, {
        data: campaign,
        expiresAt: Date.now() + CACHE_TTL_MS,
      })
      return campaign
    })
    .finally(() => {
      campaignRequests.delete(cacheKey)
    })

  campaignRequests.set(cacheKey, request)
  return request
}

export function useCampaignSummary({
  includeExpenses = false,
}: {
  includeExpenses?: boolean
} = {}) {
  const [campaign, setCampaign] = useState<CampaignSummary>(initialSummary)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCampaign = async () => {
      try {
        const data = await loadCampaign(includeExpenses)
        if (isMounted) setCampaign(data)
      } catch (error) {
        console.error('Gagal mengambil status campaign:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCampaign()

    return () => {
      isMounted = false
    }
  }, [includeExpenses])

  return { campaign, loading }
}

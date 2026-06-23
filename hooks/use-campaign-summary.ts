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
  latestDonationAt: null,
  expenses: [],
}

export function useCampaignSummary() {
  const [campaign, setCampaign] = useState<CampaignSummary>(initialSummary)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch('/api/campaign')
        if (response.ok) {
          const data = await response.json()
          setCampaign({
            settings: {
              ...defaultCampaignSettings,
              ...(data.settings || {}),
            },
            totalAmount: data.totalAmount || 0,
            totalDonors: data.totalDonors || 0,
            totalSpent: data.totalSpent || 0,
            remainingAmount: data.remainingAmount || 0,
            latestDonationAt: data.latestDonationAt || null,
            expenses: data.expenses || [],
          })
        }
      } catch (error) {
        console.error('Gagal mengambil status campaign:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [])

  return { campaign, loading }
}

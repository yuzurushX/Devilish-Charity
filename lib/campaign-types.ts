export type DonationStatus = 'open' | 'closed'

export type CampaignStage =
  | 'open'
  | 'closed'
  | 'preparing'
  | 'distributed'
  | 'completed'

export interface CampaignSettings {
  donation_status: DonationStatus
  campaign_title: string
  target_amount: number
  event_name: string | null
  event_date: string | null
  event_location: string | null
  event_description: string | null
  progress_stage: CampaignStage
  progress_note: string | null
  updated_at: string | null
  updated_by: string | null
}

export interface CampaignSummary {
  settings: CampaignSettings
  totalAmount: number
  totalDonors: number
  totalSpent: number
  remainingAmount: number
  expenseCount: number
  latestDonationAt: string | null
  expenses: CharityExpense[]
}

export interface CharityExpense {
  id: string
  title: string
  category: string | null
  amount: number
  description: string | null
  proof_url: string | null
  spent_at: string
  created_at: string
  created_by: string | null
}

export const defaultCampaignSettings: CampaignSettings = {
  donation_status: 'open',
  campaign_title: 'Devilish Charity',
  target_amount: 0,
  event_name: '',
  event_date: '',
  event_location: '',
  event_description: '',
  progress_stage: 'open',
  progress_note: '',
  updated_at: null,
  updated_by: null,
}

export const campaignStageLabels: Record<CampaignStage, string> = {
  open: 'Donasi Dibuka',
  closed: 'Donasi Ditutup',
  preparing: 'Persiapan Kegiatan',
  distributed: 'Penyaluran Berlangsung',
  completed: 'Dokumentasi Dipublikasikan',
}

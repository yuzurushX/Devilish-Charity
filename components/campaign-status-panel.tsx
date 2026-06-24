'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ReceiptText,
  HeartHandshake,
  MapPin,
  Target,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { campaignStageLabels, type CampaignStage } from '@/lib/campaign-types'
import { useCampaignSummary } from '@/hooks/use-campaign-summary'
import { PosterDecorations } from '@/components/poster-decorations'

const stages: CampaignStage[] = [
  'open',
  'closed',
  'preparing',
  'distributed',
  'completed',
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string | null) {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function CampaignStatusPanel({
  compact = false,
  showAction = true,
}: {
  compact?: boolean
  showAction?: boolean
}) {
  const { campaign } = useCampaignSummary()
  const { settings, totalAmount, totalDonors, totalSpent, remainingAmount, latestDonationAt } = campaign
  const isClosed = settings.donation_status === 'closed'
  const currentStageIndex = stages.indexOf(settings.progress_stage)
  const targetAmount = settings.target_amount || 0
  const progress = targetAmount
    ? Math.min(100, Math.round((totalAmount / targetAmount) * 100))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
    >
      <Card className="relative overflow-hidden border-primary/20 bg-card/60 p-6 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <PosterDecorations compact className="opacity-25" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {isClosed ? <Clock className="h-4 w-4" /> : <HeartHandshake className="h-4 w-4" />}
              {isClosed ? 'Donasi Sedang Ditutup' : 'Donasi Sedang Dibuka'}
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl tracking-normal">
              {settings.campaign_title}
            </h2>

            <p className="mt-3 text-muted-foreground leading-relaxed">
              {isClosed
                ? 'Terima kasih untuk semua dukungan yang sudah masuk. Pantau informasi kegiatan dan progres penyaluran donasi di sini.'
                : 'Setiap donasi yang masuk akan diverifikasi dan ditampilkan secara transparan untuk mendukung kegiatan komunitas.'}
            </p>

            {(settings.event_name || settings.event_location || settings.event_date) && (
              <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {settings.event_name && (
                  <div className="flex items-start gap-2">
                    <HeartHandshake className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{settings.event_name}</span>
                  </div>
                )}
                {settings.event_date && (
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{formatDate(settings.event_date)}</span>
                  </div>
                )}
                {settings.event_location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{settings.event_location}</span>
                  </div>
                )}
              </div>
            )}

            {settings.event_description && !compact && (
              <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                {settings.event_description}
              </p>
            )}
          </div>

          <div className="min-w-[240px] rounded-lg border border-primary/20 bg-background/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Target className="h-4 w-4" />
              Progress Donasi
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalDonors} donatur terverifikasi
            </p>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-md bg-primary/5 px-3 py-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ReceiptText className="h-4 w-4 text-primary" />
                  Terpakai
                </span>
                <span className="font-semibold text-foreground">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md bg-primary/5 px-3 py-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" />
                  Saldo
                </span>
                <span className="font-semibold text-foreground">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>

            {targetAmount > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Target {formatCurrency(targetAmount)}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            )}

            {latestDonationAt && (
              <p className="mt-3 text-xs text-muted-foreground">
                Update terakhir: {formatDate(latestDonationAt)}
              </p>
            )}
          </div>
        </div>

        {!compact && (
          <div className="relative z-10 mt-8">
            <div className="grid gap-3 md:grid-cols-5">
              {stages.map((stage, index) => {
                const isComplete = index <= currentStageIndex

                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className={`rounded-lg border p-3 text-sm ${
                      isComplete
                        ? 'border-primary/40 bg-primary/10 text-foreground'
                        : 'border-border bg-background/40 text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2
                      className={`mb-2 h-4 w-4 ${
                        isComplete ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span className="font-medium">{campaignStageLabels[stage]}</span>
                  </motion.div>
                )
              })}
            </div>

            {settings.progress_note && (
              <p className="mt-4 rounded-lg border border-primary/20 bg-background/60 p-4 text-sm text-muted-foreground">
                {settings.progress_note}
              </p>
            )}
          </div>
        )}

        {showAction && (
          <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row">
            {isClosed ? (
              <Link href="/transparansi">
                <Button className="w-full sm:w-auto">Lihat Progress</Button>
              </Link>
            ) : (
              <Link href="/donate">
                <Button className="w-full sm:w-auto">Donasi Sekarang</Button>
              </Link>
            )}
            <Link href="/guide">
              <Button variant="outline" className="w-full sm:w-auto">
                Panduan
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

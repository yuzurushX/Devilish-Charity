'use client'

import Link from 'next/link'
import { ArrowRight, DollarSign, ReceiptText, Users, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { CampaignStatusPanel } from '@/components/campaign-status-panel'
import { PosterDecorations } from '@/components/poster-decorations'
import { useCampaignSummary } from '@/hooks/use-campaign-summary'

export default function Transparansi() {
  const { campaign } = useCampaignSummary()

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <PosterDecorations compact />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 text-foreground tracking-normal">
              Transparansi <span className="text-primary">Donasi</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Ringkasan dana masuk, dana keluar, dan progres kegiatan Devilish Charity.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <CampaignStatusPanel showAction={false} />
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <DollarSign className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Dana Masuk</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.totalAmount)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {campaign.totalDonors} donatur terverifikasi
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <ReceiptText className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Dana Keluar</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.totalSpent)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {campaign.expenseCount} catatan belanja
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <Wallet className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Sisa Dana</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.remainingAmount)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Saldo setelah catatan belanja
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors">
            <Users className="w-8 h-8 mb-4 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2 tracking-normal">
              Donasi Masuk
            </h2>
            <p className="text-muted-foreground mb-6">
              Lihat daftar donatur terverifikasi, nominal, tanggal, dan pesan dari donatur.
            </p>
            <Link href="/transparansi/donasi">
              <Button className="gap-2">
                Lihat Donasi Masuk
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors">
            <ReceiptText className="w-8 h-8 mb-4 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2 tracking-normal">
              Dana Keluar
            </h2>
            <p className="text-muted-foreground mb-6">
              Lihat rincian belanja charity, kategori, nominal, tanggal, catatan, dan bukti.
            </p>
            <Link href="/transparansi/belanja">
              <Button className="gap-2">
                Lihat Dana Keluar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

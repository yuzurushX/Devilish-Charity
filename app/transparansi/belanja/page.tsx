'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, ExternalLink, ReceiptText, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useCampaignSummary } from '@/hooks/use-campaign-summary'

export default function DanaKeluar() {
  const { campaign } = useCampaignSummary()

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="container mx-auto px-4 py-16">
        <Link href="/transparansi">
          <Button variant="outline" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ringkasan
          </Button>
        </Link>

        <div className="max-w-4xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Dana <span className="text-primary">Keluar</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Rincian penggunaan dana charity untuk kebutuhan kegiatan dan penyaluran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-12">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <DollarSign className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Dana Masuk</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.totalAmount)}
            </p>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <ReceiptText className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Dana Terpakai</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.totalSpent)}
            </p>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <Wallet className="w-7 h-7 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Sisa Dana</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(campaign.remainingAmount)}
            </p>
          </Card>
        </div>

        {campaign.expenses.length === 0 ? (
          <Card className="p-10 text-center bg-card/50 backdrop-blur-sm border border-primary/20 max-w-6xl">
            <p className="text-lg text-foreground">Belum ada catatan dana keluar.</p>
            <p className="text-muted-foreground mt-2">
              Catatan belanja charity akan tampil setelah admin menambahkannya.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
            {campaign.expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-primary">{expense.title}</h3>
                        {expense.category ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary">
                            {expense.category}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(expense.spent_at)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>

                  {expense.description && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {expense.description}
                    </p>
                  )}

                  {expense.proof_url && (
                    <a
                      href={expense.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Lihat bukti belanja
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

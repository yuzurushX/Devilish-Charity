'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import type { Donation } from '@/lib/donation-types'

export default function DonasiMasuk() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations')
        if (response.ok) {
          const data = await response.json()
          setDonations(data.donations || [])
        }
      } catch (error) {
        console.error('Gagal mengambil data donasi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)

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
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-normal">
            Donasi <span className="text-primary">Masuk</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Daftar donasi yang sudah diverifikasi dan masuk ke transparansi publik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-12">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <DollarSign className="w-8 h-8 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Total Donasi Terkumpul</p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20">
            <Users className="w-8 h-8 mb-4 text-primary" />
            <p className="text-sm mb-2 text-muted-foreground">Jumlah Donatur</p>
            <p className="text-3xl font-bold text-foreground">{donations.length}</p>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Memuat data donasi...
          </div>
        ) : donations.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border border-primary/20">
            <p className="text-lg text-foreground">Belum ada donasi yang diverifikasi.</p>
            <p className="text-muted-foreground mt-2">
              Donasi yang disetujui admin akan tampil di sini.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
            {donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-primary">{donation.name}</h3>
                        {donation.is_anonymous ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary">
                            Anonim
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(donation.created_at)}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(donation.amount)}
                    </p>
                  </div>

                  {donation.message && (
                    <div className="mt-4 p-4 rounded-lg border-l-2 bg-primary/5 border-primary/20">
                      <p className="text-sm italic text-foreground">
                        &quot;{donation.message}&quot;
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                    <span className="text-primary font-medium">Donasi Terverifikasi</span>
                  </div>
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

'use client'

import Link from "next/link"
import { Heart } from 'lucide-react'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import type { Donation } from '@/lib/donation-types'

export default function Transparansi() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalDonors, setTotalDonors] = useState(0)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations')
        if (response.ok) {
          const data = await response.json()
          setDonations(data.donations || [])

          const total = data.donations.reduce(
            (sum: number, d: Donation) => sum + d.amount,
            0
          )
          setTotalAmount(total)
          setTotalDonors(data.donations.length)
        }
      } catch (error) {
        console.error('Gagal mengambil data donasi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

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

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Transparansi <span className="text-primary">Donasi</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Transparansi penuh untuk setiap donasi yang terverifikasi dan mendukung tujuan sosial dengan Devilish Charity.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative overflow-hidden border-t border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors">
              <DollarSign className="w-8 h-8 mx-auto mb-4 text-primary" />
              <p className="text-sm mb-2 text-muted-foreground">Total Donasi Terkumpul</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(totalAmount)}
              </p>
            </Card>

            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors">
              <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
              <p className="text-sm mb-2 text-muted-foreground">Jumlah Donatur</p>
              <p className="text-3xl font-bold text-foreground">
                {totalDonors}
              </p>
            </Card>
            
          </div>
        </div>
      </section>

      {/* List Donations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-foreground">
          Daftar Donasi <span className="text-primary">Terverifikasi</span>
        </h2>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Memuat data donasi...
          </div>
        ) : donations.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border border-primary/20">
            <p className="text-lg text-foreground">
              Belum ada donasi yang diverifikasi.
            </p>
            <p className="text-muted-foreground mt-2">
              Jadilah yang pertama membuat perbedaan melalui Devilish Charity.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {donations.map((donation) => (
              <Card
                key={donation.id}
                className="p-6 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-primary">
                        {donation.name}
                      </h3>
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
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

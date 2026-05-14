'use client'

import Link from "next/link"
import { Heart } from 'lucide-react'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MobileNav } from '@/components/mobile-nav'

interface Donation {
  id: string
  name: string
  amount: number
  message: string | null
  created_at: string
}

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
    <div style={{ backgroundColor: '#0D0A0B' }} className="min-h-screen">
      {/* Navigation */}
      <MobileNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#FF5A1F' }}>
            Transparansi Donasi
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#F3F0EC' }}>
            Transparansi penuh for every verified donation supporting meaningful causes with Devilish Charity.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ backgroundColor: '#6E0F1F', borderColor: '#2A2527', borderTopWidth: '1px', borderBottomWidth: '1px' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 text-center" style={{ backgroundColor: '#1A1517' }}>
              <DollarSign className="w-8 h-8 mx-auto mb-4" style={{ color: '#D88A1C' }} />
              <p className="text-sm mb-2" style={{ color: '#F3F0EC' }}>Total Donasi Terkumpul</p>
              <p className="text-3xl font-bold" style={{ color: '#FF5A1F' }}>
                {formatCurrency(totalAmount)}
              </p>
            </Card>

            <Card className="p-6 text-center" style={{ backgroundColor: '#1A1517' }}>
              <Users className="w-8 h-8 mx-auto mb-4" style={{ color: '#D88A1C' }} />
              <p className="text-sm mb-2" style={{ color: '#F3F0EC' }}>Jumlah Pendonasi</p>
              <p className="text-3xl font-bold" style={{ color: '#FF5A1F' }}>
                {totalDonors}
              </p>
            </Card>
            
          </div>
        </div>
      </section>

      {/* List Donations */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#FF5A1F' }}>
          Daftar Donasi Terverifikasi
        </h2>

        {loading ? (
          <div className="text-center py-12" style={{ color: '#F3F0EC' }}>
            Memuat data donasi...
          </div>
        ) : donations.length === 0 ? (
          <Card className="p-12 text-center" style={{ backgroundColor: '#1A1517' }}>
            <p className="text-lg" style={{ color: '#F3F0EC' }}>
              Belum ada donasi yang disetujui yet.
            </p>
            <p className="text-slate-400 mt-2">
              Jadilah yang pertama membuat perbedaan with Devilish Charity.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donations.map((donation) => (
              <Card
                key={donation.id}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{ backgroundColor: '#1A1517', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#FF5A1F' }}>
                      {donation.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#F3F0EC' }}>
                      {formatDate(donation.created_at)}
                    </p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#FF5A1F' }}>
                    {formatCurrency(donation.amount)}
                  </p>
                </div>

                {donation.message && (
                  <div className="mt-4 p-4 rounded-lg border-l-2" style={{ backgroundColor: '#0D0A0B', borderLeftColor: '#FF5A1F' }}>
                    <p className="text-sm italic" style={{ color: '#F3F0EC' }}>
                      &quot;{donation.message}&quot;
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#FF5A1F' }} />
                  <span style={{ color: '#FF5A1F' }}>Verified Donation</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#1A1517' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>About Us</h4>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Devilish Charity is a community-driven initiative dedicated to creating real impact through transparent and trusted giving.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>Navigation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/guide" className="transition" style={{ color: '#F3F0EC' }}>
                  Donation Guide
                </Link>
                <br />
                <Link href="/transparansi" className="transition" style={{ color: '#F3F0EC' }}>
                  Transparency Report
                </Link>
                <br />
                <Link href="/donate" className="transition" style={{ color: '#F3F0EC' }}>
                  Donation Form
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>Contact</h4>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Email: <span style={{ color: '#FF5A1F' }}>devilishcommunity@gmail.com</span>
              </p>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Active support for community impact
              </p>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: '#2A2527', color: '#F3F0EC' }}>
            <p>
              &copy; 2026 Devilish Charity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

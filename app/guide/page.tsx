'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

import { MobileNav } from '@/components/mobile-nav'
import { Card } from '@/components/ui/card'

export default function Guide() {
  return (
    <div style={{ backgroundColor: '#0D0A0B' }} className="min-h-screen">
      {/* Navigation */}
      <MobileNav />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#FF5A1F' }}>
            Panduan Donasi
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#F3F0EC' }}>
            Ikuti langkah-langkah sederhana ini to make your donation and contribute to meaningful causes with Devilish Charity.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Step 1 */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white text-lg font-bold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF5A1F' }}>
                  Klik Tombol Donasi
                </h3>
                <p className="mb-4" style={{ color: '#F3F0EC' }}>
                  Go to the donation page and click the <b>Donate Now</b> button to
                  start the form process.
                </p>
                <div className="p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 Tip: Prepare your donation amount and payment method before proceeding.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white text-lg font-bold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF5A1F' }}>
                  Isi Data Donasi
                </h3>
                <p className="mb-4" style={{ color: '#F3F0EC' }}>
                  Enter your donation amount and payment details. Optionally add your name, Discord username, and a message. You can use the <b>anonymous donation</b> option to hide your name and Discord on the public transparency list (admins still verify your payment).
                </p>
                <div className="p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 If you are not anonymous, your Discord username helps us contact you if needed.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white text-lg font-bold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF5A1F' }}>
                  Pilih Metode Pembayaran
                </h3>
                <p className="mb-4" style={{ color: '#F3F0EC' }}>
                  Pilih metode pembayaran favorit Anda seperti transfer bank atau dompet digital.
                </p>
                <div className="p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 Gunakan metode yang paling nyaman untuk Anda.
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Account Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-20 w-32 rounded-md flex-shrink-0">
                <Image 
                  src="/smbc-logo.png"
                  alt="SMBC Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#FF5A1F' }}>
                  Informasi Rekening Bank
                </h3>
                <div className="space-y-3" style={{ color: '#F3F0EC' }}>
                  <div>
                    <p className="text-sm" style={{ color: '#D88A1C' }}>Bank</p>
                    <p className="font-semibold">SMBC (Sumitomo Mitsui Banking Corporation)</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#D88A1C' }}>Nomor Rekening</p>
                    <p className="font-semibold font-mono text-lg">90012331247</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#D88A1C' }}>Atas Nama (a.n.)</p>
                    <p className="font-semibold">Ahmad Fadillah Ruswansyah</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 Lakukan transfer ke rekening ini dan upload bukti transfer pada form donasi.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white text-lg font-bold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF5A1F' }}>
                  Upload Bukti Transfer
                </h3>
                <p className="mb-4" style={{ color: '#F3F0EC' }}>
                  Upload your payment receipt so our team can verify your donation.
                </p>
                <div className="p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 Make sure the amount and transaction details are clearly visible.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 5 */}
          <Card className="p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderLeftColor: '#FF5A1F', borderLeftWidth: '4px' }}>
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white text-lg font-bold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                5
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF5A1F' }}>
                  Kirim Submit & Wait for Verification Tunggu Verifikasi
                </h3>
                <p className="mb-4" style={{ color: '#F3F0EC' }}>
                  After submission, your donation will be verified by our admin team. Approved donations will appear on the Transparency page.
                </p>
                <div className="p-4 rounded-md text-sm" style={{ backgroundColor: '#2A2527', color: '#F3F0EC' }}>
                  💡 Verification typically takes up to 24 hours.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 mt-12" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderTopWidth: '1px', borderBottomWidth: '1px' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#FF5A1F' }}>
            Pertanyaan Umum
          </h2>

          <div className="space-y-6">
            <div className="border-b pb-6" style={{ borderColor: '#2A2527' }}>
              <h3 className="font-bold mb-2" style={{ color: '#FF5A1F' }}>
                How long does verification take?
              </h3>
              <p style={{ color: '#F3F0EC' }}>
                Typically up to 24 hours after you submit your proof of payment.
              </p>
            </div>

            <div className="border-b pb-6" style={{ borderColor: '#2A2527' }}>
              <h3 className="font-bold mb-2" style={{ color: '#FF5A1F' }}>
                Is my data secure?
              </h3>
              <p style={{ color: '#F3F0EC' }}>
                Yes. Your data is only used for donation verification purposes.
              </p>
            </div>

            <div className="border-b pb-6" style={{ borderColor: '#2A2527' }}>
              <h3 className="font-bold mb-2" style={{ color: '#FF5A1F' }}>
                Can I donate multiple times?
              </h3>
              <p style={{ color: '#F3F0EC' }}>
                Absolutely! Each donation will be recorded and verified separately.
              </p>
            </div>

            <div className="border-b pb-6" style={{ borderColor: '#2A2527' }}>
              <h3 className="font-bold mb-2" style={{ color: '#FF5A1F' }}>
                What is an anonymous donation?
              </h3>
              <p style={{ color: '#F3F0EC' }}>
                If you check the anonymous option on the form, your name and Discord username are not shown on the public transparency page. Admins can still see what they need to verify your transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F3F0EC' }}>
            Siap Berbagi dan Membuat Perbedaan?
          </h2>
          <p className="mb-8" style={{ color: '#F3F0EC' }}>
            Bergabunglah dengan kami dalam menciptakan dampak nyata through Devilish Charity.
          </p>
          <Link href="/donate">
            <Button size="lg" className="text-white font-semibold" style={{ backgroundColor: '#6E0F1F', color: '#F3F0EC' }}>
              Donate Now
            </Button>
          </Link>
        </Card>
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
                  Panduan Donasi
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

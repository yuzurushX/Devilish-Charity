'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'

export default function Guide() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Panduan <span className="text-primary">Donasi</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Ikuti langkah-langkah sederhana ini to make your donation and contribute to meaningful causes with Devilish Charity.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-lg font-bold bg-primary/20 text-primary shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  Klik Tombol Donasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Go to the donation page and click the <b>Donate Now</b> button to
                  start the form process.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Tip: Prepare your donation amount and payment method before proceeding.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-lg font-bold bg-primary/20 text-primary shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  Isi Data Donasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Enter your donation amount and payment details. Optionally add your name, Discord username, and a message. You can use the <b>anonymous donation</b> option to hide your name and Discord on the public transparency list (admins still verify your payment).
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 If you are not anonymous, your Discord username helps us contact you if needed.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-lg font-bold bg-primary/20 text-primary shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  Pilih Metode Pembayaran
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Pilih metode pembayaran favorit Anda seperti transfer bank atau dompet digital.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Gunakan metode yang paling nyaman untuk Anda.
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Account Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
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
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Informasi Rekening Bank
                </h3>
                <div className="space-y-3 text-foreground">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="font-semibold">SMBC (Sumitomo Mitsui Banking Corporation)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                    <p className="font-semibold font-mono text-lg">90012331247</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atas Nama (a.n.)</p>
                    <p className="font-semibold">Ahmad Fadillah Ruswansyah</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Lakukan transfer ke rekening ini dan upload bukti transfer pada form donasi.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-lg font-bold bg-primary/20 text-primary shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  Upload Bukti Transfer
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Upload your payment receipt so our team can verify your donation.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Make sure the amount and transaction details are clearly visible.
                </div>
              </div>
            </div>
          </Card>

          {/* Step 5 */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
            <div className="flex gap-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white text-lg font-bold bg-primary/20 text-primary shrink-0">
                5
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  Kirim Submit & Wait for Verification Tunggu Verifikasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                  After submission, your donation will be verified by our admin team. Approved donations will appear on the Transparency page.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Verification typically takes up to 24 hours.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 mt-12 relative overflow-hidden border-t border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Pertanyaan <span className="text-primary">Umum</span>
            </h2>

            <div className="space-y-6">
              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  How long does verification take?
                </h3>
                <p className="text-muted-foreground">
                  Typically up to 24 hours after you submit your proof of payment.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  Is my data secure?
                </h3>
                <p className="text-muted-foreground">
                  Yes. Your data is only used for donation verification purposes.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  Can I donate multiple times?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! Each donation will be recorded and verified separately.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  What is an anonymous donation?
                </h3>
                <p className="text-muted-foreground">
                  If you check the anonymous option on the form, your name and Discord username are not shown on the public transparency page. Admins can still see what they need to verify your transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border border-primary/20 p-8 md:p-16 text-center">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Siap Berbagi dan Membuat <span className="text-primary">Perbedaan</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
              Bergabunglah dengan kami dalam menciptakan dampak nyata through Devilish Charity.
            </p>
            <Link href="/donate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

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
              Ikuti langkah-langkah sederhana ini untuk berdonasi dan berkontribusi dalam menciptakan dampak positif bersama Devilish Charity.
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
                  Pada halaman utama, klik tombol <b>Donasi Sekarang</b> untuk memulai proses donasi.
                </p>
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
                  Lakukan Transfer Donasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Transfer donasi Anda ke salah satu rekening yang tersedia pada halaman donasi sebelum mengisi formulir pengajuan.
                </p>
          
                <div className="mt-4 p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Simpan bukti transfer karena akan diperlukan saat mengisi form donasi.
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
                  Isi Form Donasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Masukkan jumlah donasi dan detail informasi Anda. Anda dapat menggunakan opsi <b>Donasi Anonim</b> untuk menyembunyikan nama dan Discord Anda dari daftar transparansi publik (admin tetap memverifikasi pembayaran Anda).
                </p>
          
                <div className="mt-4 p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Dengan mengisi username Discord, Anda akan diundang ke server Discord Devilish dan mendapatkan update kegiatan charity.
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
                  Upload bukti transfer sehingga admin dapat memverifikasi donasi Anda.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                💡 Pastikan jumlah, nama, dan detail transaksi terlihat jelas agar admin dapat memverifikasi donasi Anda.
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
                  Kirim dan Tunggu Verifikasi
                </h3>
                <p className="mb-4 text-muted-foreground">
                 Donasi Anda akan diverifikasi oleh tim admin. Donasi yang disetujui akan muncul di halaman Transparansi.
                </p>
                <div className="p-4 rounded-lg text-sm bg-primary/5 text-foreground border border-primary/20">
                  💡 Verifikasi biasanya memakan waktu hingga 24 jam. Anda bisa cek berkala di halaman Transparnasi.
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
                  Berapa lama proses verifikasi berlangsung?
                </h3>
                <p className="text-muted-foreground">
                  Biasanya hingga 24 jam setelah Anda mengirimkan pengajuan verifikasi.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  Apakah data saya aman?
                </h3>
                <p className="text-muted-foreground">
                  Ya. Data Anda hanya digunakan untuk tujuan verifikasi donasi.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  Bisakah saya berdonasi beberapa kali?
                </h3>
                <p className="text-muted-foreground">
                  Tentu saja! Setiap donasi akan dicatat dan diverifikasi secara terpisah.
                </p>
              </div>

              <div className="border-b border-primary/20 pb-6">
                <h3 className="font-bold mb-2 text-primary">
                  Apa itu Donasi Anonim?
                </h3>
                <p className="text-muted-foreground">
                  Jika Anda memilih opsi <b>Donasi Anonim</b> pada formulir, nama dan username Discord Anda tidak akan ditampilkan di halaman transparansi publik. Admin masih dapat melihat informasi yang mereka butuhkan untuk memverifikasi transfer Anda.
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
              Bergabunglah dengan kami dalam menciptakan dampak nyata melalui Devilish Charity.
            </p>
            <Link href="/donate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Donasi Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

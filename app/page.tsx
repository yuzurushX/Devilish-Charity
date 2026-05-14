'use client'

import Link from 'next/link'
import { Users, Zap, BarChart3, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MobileNav } from '@/components/mobile-nav'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0D0A0B' }} className="min-h-screen">
      {/* Navigation */}
      <MobileNav />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: '#FF5A1F' }}>
            Devilish Charity
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#F3F0EC' }}>
            Buat perbedaan yang kuat dengan berbagi yang transparan dan terpercaya. Setiap kontribusi membawa harapan dan dukungan bagi mereka yang membutuhkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="w-full sm:w-auto font-semibold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                Donasi Sekarang
              </Button>
            </Link>
            <Link href="/guide">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold bg-transparent" style={{ color: '#FF5A1F', borderColor: '#FF5A1F' }}>
                Panduan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12" style={{ backgroundColor: '#6E0F1F' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#D88A1C' }}>500+</div>
              <p style={{ color: '#F3F0EC' }}>Donatur Aktif</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#D88A1C' }}>Rp 50M+</div>
              <p style={{ color: '#F3F0EC' }}>Total Terkumpul</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#D88A1C' }}>1000+</div>
              <p style={{ color: '#F3F0EC' }}>Kehidupan Terbantu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#FF5A1F' }}>Berdonasi Bersama Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
            <div className="flex items-start gap-4">
              <BarChart3 className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#D88A1C' }} />
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Transparansi</h3>
                <p style={{ color: '#F3F0EC' }}>
                  Setiap donasi dicatat dan ditampilkan secara terbuka. Kamu bisa melihat total dana terkumpul dan penggunaannya secara transparan.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#D88A1C' }} />
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Amanah & Terpercaya</h3>
                <p style={{ color: '#F3F0EC' }}>
                  Donasi dikelola dengan penuh tanggung jawab. Setiap pemasukan diumumkan secara terbuka demi menjaga kepercayaan bersama.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#D88A1C' }} />
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Gerakan Komunitas</h3>
                <p style={{ color: '#F3F0EC' }}>
                  Devilish Charity digerakkan oleh komunitas. Bersama, kita saling membantu dan menghadirkan dampak nyata bagi sesama.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#D88A1C' }} />
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Tepat Sasaran</h3>
                <p style={{ color: '#F3F0EC' }}>
                  Donasi disalurkan untuk aksi sosial yang bermakna, dari bantuan langsung hingga berbagi dengan mereka yang membutuhkan.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#6E0F1F' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#F3F0EC' }}>
            Buat Perbedaan yang Kuat Hari Ini
          </h2>
          <p className="text-lg mb-8" style={{ color: '#F3F0EC' }}>
            Setiap donasi yang kamu berikan menciptakan dampak nyata. Dari dukungan komunitas hingga proyek bermakna, hadiah kamu membuat perbedaan di tempat yang paling penting.
          </p>
          <Link href="/donate">
            <Button
              size="lg"
              className="font-semibold"
              style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
            >
              Donasi Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#1A1517' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>Tentang Kami</h4>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Devilish Charity adalah inisiatif yang didorong komunitas untuk menciptakan dampak nyata melalui berbagi yang transparan dan terpercaya. Bersama, kami memberdayakan komunitas dan mendukung mereka yang membutuhkan.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>Navigasi</h4>
              <div className="space-y-2 text-sm">
                <Link href="/guide" className="transition" style={{ color: '#F3F0EC' }}>
                  Panduan Donasi
                </Link>
                <br />
                <Link href="/transparansi" className="transition" style={{ color: '#F3F0EC' }}>
                  Transparansi Donasi
                </Link>
                <br />
                <Link href="/donate" className="transition" style={{ color: '#F3F0EC' }}>
                  Form Donasi
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: '#FF5A1F' }}>Kontak</h4>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Email: <span style={{ color: '#FF5A1F' }}>devilishcommunity@gmail.com</span>
              </p>
              <p className="text-sm" style={{ color: '#F3F0EC' }}>
                Dukungan aktif untuk dampak komunitas
              </p>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: '#2A2527', color: '#F3F0EC' }}>
            <p>
              &copy; 2026 Devilish Charity. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

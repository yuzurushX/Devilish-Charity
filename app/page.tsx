'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Zap, BarChart3, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

function StatCard({
  label,
  value,
  delay,
}: {
  label: string
  value: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors"
    >
      <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm text-primary font-medium">Gerakan Komunitas</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
              >
                Devilish{' '}
                <span className="text-primary glow-text">Charity</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-balance"
              >
                Buat perbedaan yang kuat dengan berbagi yang transparan dan terpercaya. Setiap kontribusi
                membawa harapan dan dukungan bagi mereka yang membutuhkan.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/donate">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg glow-primary w-full sm:w-auto">
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Donasi Sekarang
                  </Button>
                </Link>
                <Link href="/guide">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/10 w-full sm:w-auto">
                    Panduan
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto"
            >
              <StatCard label="Donatur Aktif" value="500+" delay={0.5} />
              <StatCard label="Total Terkumpul" value="Rp 50M+" delay={0.55} />
              <StatCard label="Kehidupan Terbantu" value="1000+" delay={0.6} />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Berdonasi <span className="text-primary">Bersama Kami</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: 'Transparansi',
                body:
                  'Setiap donasi dicatat dan ditampilkan secara terbuka. Kamu bisa melihat total dana terkumpul dan penggunaannya secara transparan.',
              },
              {
                icon: Zap,
                title: 'Amanah & Terpercaya',
                body:
                  'Donasi dikelola dengan penuh tanggung jawab. Setiap pemasukan diumumkan secara terbuka demi menjaga kepercayaan bersama.',
              },
              {
                icon: Users,
                title: 'Gerakan Komunitas',
                body:
                  'Devilish Charity digerakkan oleh komunitas. Bersama, kita saling membantu dan menghadirkan dampak nyata bagi sesama.',
              },
              {
                icon: Heart,
                title: 'Tepat Sasaran',
                body:
                  'Donasi disalurkan untuk aksi sosial yang bermakna, dari bantuan langsung hingga berbagi dengan mereka yang membutuhkan.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border border-primary/20 p-8 md:p-16 text-center"
          >
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 mx-auto">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Buat Perbedaan yang <span className="text-primary">Kuat</span> Hari Ini
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
                Setiap donasi yang kamu berikan menciptakan dampak nyata. Dari dukungan komunitas hingga proyek
                bermakna, kontribusi kamu membuat perbedaan di tempat yang paling penting.
              </p>
              <Link href="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Donasi Sekarang
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/devilish-charity-logo.webp" 
                alt="Devilish Charity" 
                height={40}
                width={150}
                className="object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Inisiatif yang didorong komunitas untuk dampak nyata melalui berbagi yang transparan dan
              terpercaya. Setiap donasi tercatat dan dilaporkan secara terbuka.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-primary transition-colors">
                  Form Donasi
                </Link>
              </li>
              <li>
                <Link href="/transparansi" className="text-muted-foreground hover:text-primary transition-colors">
                  Transparansi
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Panduan Donasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                Email:{' '}
                <a href="mailto:devilishcommunity@gmail.com" className="text-primary hover:underline">
                  devilishcommunity@gmail.com
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Devilish Charity. Semua hak dilindungi.
          </p>
          <p className="text-muted-foreground text-sm">
            Dibuat dengan ❤️ oleh komunitas
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { href: '/guide', label: 'Panduan' },
    { href: '/transparansi', label: 'Transparansi' },
    { href: '/admin', label: 'Admin' },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: '#0D0A0B', borderColor: '#2A2527' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/charity-ejme6fjtgbXGx4hylXdp3bV3PdiUHn.webp"
              alt="Devilish Charity Logo"
              width={80}
              height={30}
              priority
              className="w-auto h-8 md:h-10 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition font-medium hover:text-orange-400"
                style={{ color: '#F3F0EC' }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/donate">
              <Button className="text-white font-semibold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                Donasi Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg transition"
            style={{ backgroundColor: '#1A1517' }}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" style={{ color: '#FF5A1F' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: '#FF5A1F' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: '#1A1517' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block px-4 py-2 rounded-lg transition font-medium"
                style={{ color: '#F3F0EC' }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/donate" onClick={closeMenu} className="block px-4 pt-2">
              <Button className="w-full font-semibold" style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}>
                Donasi Sekarang
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

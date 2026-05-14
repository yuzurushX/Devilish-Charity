'use client'

import Link from "next/link"
import { Heart } from 'lucide-react'
import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MobileNav } from '@/components/mobile-nav'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  React.useEffect(() => {
    // Check if setup is required
    const checkSetup = async () => {
      try {
        const response = await fetch('/api/admin/setup')
        const data = await response.json()
        setSetupRequired(data.setupRequired)
      } catch (error) {
        console.error('Setup check error:', error)
        setSetupRequired(false)
      }
    }

    checkSetup()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login gagal')
        return
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('admin_token', data.token)
      }

      // Redirect to dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Setup gagal')
        return
      }

      // Setup successful, now login
      setUsername(username)
      setPassword(password)
      setSetupRequired(false)

      // Auto-login after setup
      const loginResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const loginData = await loginResponse.json()

      if (loginData.token) {
        localStorage.setItem('admin_token', loginData.token)
      }

      router.push('/admin/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      setError(message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#0D0A0B' }} className="min-h-screen flex flex-col">
      {/* Navigation */}
      <MobileNav />

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {setupRequired === null ? (
          <Card className="w-full max-w-md p-8" style={{ backgroundColor: '#1A1517' }}>
            <div className="text-center">
              <p style={{ color: '#F3F0EC' }}>Memuat...</p>
            </div>
          </Card>
        ) : setupRequired ? (
          <Card className="w-full max-w-md p-8" style={{ backgroundColor: '#1A1517' }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FF5A1F' }}>
                <LogIn className="w-8 h-8" style={{ color: '#F3F0EC' }} />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Setup Admin Pertama</h1>
              <p style={{ color: '#F3F0EC' }}>Buat akun Master Admin untuk mengelola platform</p>
            </div>

            {error && (
              <div className="rounded-lg p-4 mb-6 flex gap-3" style={{ backgroundColor: '#3D1F1F', borderColor: '#FF5A1F', borderWidth: '1px' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#FF5A1F' }} />
                <p className="text-sm" style={{ color: '#FF5A1F' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSetupSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Nama Pengguna
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  required
                  minLength={3}
                  className="w-full"
                  disabled={isCreating}
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  className="w-full"
                  disabled={isCreating}
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
              >
                {isCreating ? 'Membuat akun...' : 'Buat Master Admin'}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#3D1F1F', borderColor: '#FF5A1F', borderWidth: '1px' }}>
              <p className="text-xs" style={{ color: '#F3F0EC' }}>
                <span className="font-semibold" style={{ color: '#FF5A1F' }}>Catatan:</span> Ini adalah admin pertama yang akan menjadi Master Admin dengan kemampuan membuat admin lainnya. Simpan kredensial Anda dengan aman.
              </p>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-md p-8" style={{ backgroundColor: '#1A1517' }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FF5A1F' }}>
                <LogIn className="w-8 h-8" style={{ color: '#F3F0EC' }} />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Login Admin</h1>
              <p style={{ color: '#F3F0EC' }}>Akses panel admin untuk mengelola donasi</p>
            </div>

            {error && (
              <div className="rounded-lg p-4 mb-6 flex gap-3" style={{ backgroundColor: '#3D1F1F', borderColor: '#FF5A1F', borderWidth: '1px' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#FF5A1F' }} />
                <p className="text-sm" style={{ color: '#FF5A1F' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Nama Pengguna
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  required
                  className="w-full"
                  disabled={isLoading}
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  className="w-full"
                  disabled={isLoading}
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
              >
                {isLoading ? 'Login...' : 'Login ke Dashboard'}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#3D1F1F', borderColor: '#FF5A1F', borderWidth: '1px' }}>
              <p className="text-xs" style={{ color: '#F3F0EC' }}>
                <span className="font-semibold" style={{ color: '#FF5A1F' }}>Akses Admin:</span> Hubungi administrator Anda untuk mendapatkan kredensial. Jangan bagikan password Anda dengan siapapun.
              </p>
            </div>
          </Card>
        )}
      </div>

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

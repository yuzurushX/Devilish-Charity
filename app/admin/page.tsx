'use client'

import Link from "next/link"
import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/footer'
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
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex justify-end px-4 pt-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Beranda
        </Link>
      </div>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {setupRequired === null ? (
          <Card className="w-full max-w-md p-8 bg-card border-border">
            <div className="text-center">
              <p className="text-foreground">Memuat...</p>
            </div>
          </Card>
        ) : setupRequired ? (
          <Card className="w-full max-w-md p-8 bg-card border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-primary">Setup Admin Pertama</h1>
              <p className="text-foreground">Buat akun Master Admin untuk mengelola platform</p>
            </div>

            {error && (
              <div className="rounded-lg p-4 mb-6 flex gap-3 bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSetupSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  Nama Pengguna
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  required
                  minLength={3}
                  className="w-full bg-background border-border text-foreground"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  className="w-full bg-background border-border text-foreground"
                  disabled={isCreating}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full font-semibold py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isCreating ? 'Membuat akun...' : 'Buat Master Admin'}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-primary">Catatan:</span> Ini adalah admin pertama yang akan menjadi Master Admin dengan kemampuan membuat admin lainnya. Simpan kredensial Anda dengan aman.
              </p>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-md p-8 bg-card border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-primary">Login Admin</h1>
              <p className="text-foreground">Akses panel admin untuk mengelola donasi</p>
            </div>

            {error && (
              <div className="rounded-lg p-4 mb-6 flex gap-3 bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  Nama Pengguna
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  required
                  className="w-full bg-background border-border text-foreground"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  className="w-full bg-background border-border text-foreground"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Login...' : 'Login ke Dashboard'}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-primary">Akses Admin:</span> Hubungi administrator Anda untuk mendapatkan kredensial. Jangan bagikan password Anda dengan siapapun.
              </p>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}

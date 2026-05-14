'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Donation } from '@/lib/donation-types'

interface AdminUser {
  id: string
  username: string
  is_master_admin: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [adminUsername, setAdminUsername] = useState<string>('Admin')
  const [isMasterAdmin, setIsMasterAdmin] = useState(false)
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    // Decode token to get admin info
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      setAdminUsername(decoded.username)
      setIsMasterAdmin(decoded.is_master_admin || false)
    } catch (error) {
      console.error('Error decoding token:', error)
      router.push('/admin')
      return
    }

    fetchDonations(token)
    checkAdminStatus(token)
  }, [])

  const checkAdminStatus = async (token: string) => {
    try {
      const response = await fetch('/api/admin/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins || [])
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  const fetchDonations = async (token: string) => {
    try {
      const response = await fetch('/api/admin/donations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token')
        router.push('/admin')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])

        // Calculate stats
        const pendingCount = data.donations.filter((d: Donation) => d.status === 'pending').length
        const approvedCount = data.donations.filter((d: Donation) => d.status === 'approved').length
        const rejectedCount = data.donations.filter((d: Donation) => d.status === 'rejected').length

        setStats({
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        })
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      alert('Silakan isi semua kolom')
      return
    }

    if (newAdminPassword.length < 8) {
      alert('Password harus minimal 8 karakter')
      return
    }

    setCreatingAdmin(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword,
        }),
      })

      if (response.ok) {
        alert('Akun admin berhasil dibuat!')
        setNewAdminUsername('')
        setNewAdminPassword('')
        setShowCreateAdmin(false)
        checkAdminStatus(token)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      alert('Gagal membuat akun admin')
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleApprove = async (donationId: string) => {
    setUpdatingId(donationId)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/donations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donationId,
          status: 'approved',
          adminUsername,
        }),
      })

      if (response.ok) {
        fetchDonations(token)
      } else {
        alert('Gagal menyetujui donasi')
      }
    } catch (error) {
      console.error('Error approving donation:', error)
      alert('Terjadi kesalahan')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (donationId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menolak donasi ini?')) return

    setUpdatingId(donationId)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/donations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donationId,
          status: 'rejected',
          adminUsername,
        }),
      })

      if (response.ok) {
        fetchDonations(token)
      } else {
        alert('Gagal menolak donasi')
      }
    } catch (error) {
      console.error('Error rejecting donation:', error)
      alert('Terjadi kesalahan')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_token')
      router.push('/admin')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" style={{ color: '#FF5A1F' }} />
      case 'rejected':
        return <XCircle className="w-5 h-5" style={{ color: '#9E1228' }} />
      default:
        return <Clock className="w-5 h-5" style={{ color: '#D88A1C' }} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/charity-ejme6fjtgbXGx4hylXdp3bV3PdiUHn.webp"
                alt="Devilish Charity Logo"
                width={80}
                height={30}
                priority
                className="w-auto h-8 object-contain"
              />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#F3F0EC' }}>
                Admin: <span className="font-semibold">{adminUsername}</span>
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 bg-transparent"
                style={{ color: '#FF5A1F', borderColor: '#FF5A1F' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FF5A1F' }}>Panel Admin</h1>
          <p className="text-lg" style={{ color: '#F3F0EC' }}>
            Kelola dan setujui donasi
          </p>
        </div>

        {/* Kelola Admin Section */}
        {isMasterAdmin && (
          <Card className="mb-8 overflow-hidden" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
            <div className="p-6" style={{ borderColor: '#2A2527', borderBottomWidth: '1px' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ color: '#FF5A1F' }}>Kelola Admin</h2>
                <Button
                  onClick={() => setShowCreateAdmin(!showCreateAdmin)}
                  style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
                >
                  {showCreateAdmin ? 'Batal' : 'Buat Admin Baru'}
                </Button>
              </div>
            </div>

            {showCreateAdmin && (
              <div className="p-6" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderBottomWidth: '1px' }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                      Nama Pengguna
                    </label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="Masukkan nama pengguna admin"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
                      disabled={creatingAdmin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Masukkan password admin (min 8 karakter)"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
                      disabled={creatingAdmin}
                    />
                  </div>
                  <Button
                    onClick={handleCreateAdmin}
                    disabled={creatingAdmin}
                    style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
                  >
                    {creatingAdmin ? 'Membuat...' : 'Buat Admin'}
                  </Button>
                </div>
              </div>
            )}

            {/* Admin List */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#FF5A1F' }}>Admin Saat Ini</h3>
              {admins.length === 0 ? (
                <p style={{ color: '#F3F0EC' }}>Tidak ada admin yang ditemukan</p>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ backgroundColor: '#2A2527', borderColor: '#3A3537' }}
                    >
                      <div>
                        <p className="font-semibold" style={{ color: '#FF5A1F' }}>{admin.username}</p>
                        <p className="text-sm" style={{ color: '#D88A1C' }}>
                          {admin.is_master_admin ? '👑 Master Admin' : 'Admin Biasa'}
                        </p>
                      </div>
                      <span className="text-xs" style={{ color: '#F3F0EC' }}>
                        Dibuat: {new Date(admin.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border" style={{ backgroundColor: '#2A2527', borderColor: '#6E0F1F' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#D88A1C' }}>Tertunda</p>
                <p className="text-4xl font-bold" style={{ color: '#D88A1C' }}>{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12" style={{ color: '#D88A1C' }} />
            </div>
          </Card>
          <Card className="p-6 border" style={{ backgroundColor: '#2A2527', borderColor: '#6E0F1F' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FF5A1F' }}>Disetujui</p>
                <p className="text-4xl font-bold" style={{ color: '#FF5A1F' }}>{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#FF5A1F' }} />
            </div>
          </Card>
          <Card className="p-6 border" style={{ backgroundColor: '#2A2527', borderColor: '#6E0F1F' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#9E1228' }}>Ditolak</p>
                <p className="text-4xl font-bold" style={{ color: '#9E1228' }}>{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12" style={{ color: '#9E1228' }} />
            </div>
          </Card>
        </div>

        {/* Donations Table */}
        <Card className="overflow-hidden" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
          <div className="p-6" style={{ borderColor: '#2A2527', borderBottomWidth: '1px' }}>
            <h2 className="text-2xl font-bold" style={{ color: '#FF5A1F' }}>Daftar Donasi</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p style={{ color: '#F3F0EC' }}>Memuat donasi...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="p-12 text-center">
              <p style={{ color: '#F3F0EC' }}>Tidak ada donasi yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#2A2527', borderColor: '#3A3537', borderBottomWidth: '1px' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Jumlah</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Metode Pembayaran</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Tipe</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Tanggal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Bukti</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#FF5A1F' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} style={{ backgroundColor: '#1A1517', borderColor: '#2A2527', borderBottomWidth: '1px' }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold" style={{ color: '#FF5A1F' }}>{donation.name}</p>
                          {donation.discord_username && (
                            <p className="text-sm" style={{ color: '#D88A1C' }}>@{donation.discord_username}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: '#FF5A1F' }}>
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#F3F0EC' }}>
                        {donation.payment_method.replace('_', ' ').toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(donation.status)}
                          <span className="text-sm font-semibold capitalize" style={{ color: '#F3F0EC' }}>
                            {donation.status === 'pending' && 'Tertunda'}
                            {donation.status === 'approved' && 'Disetujui'}
                            {donation.status === 'rejected' && 'Ditolak'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span 
                          className="px-2 py-1 rounded-md text-xs font-semibold"
                          style={{ 
                            backgroundColor: donation.is_anonymous ? '#3D1F1F' : '#1A2723',
                            color: donation.is_anonymous ? '#FF5A1F' : '#F3F0EC'
                          }}
                        >
                          {donation.is_anonymous ? '🔒 Anonim' : 'Terbuka'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#F3F0EC' }}>
                        {formatDate(donation.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={donation.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold flex items-center gap-1"
                          style={{ color: '#FF5A1F' }}
                        >
                          Lihat
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {donation.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(donation.id)}
                              disabled={updatingId === donation.id}
                              style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
                            >
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(donation.id)}
                              disabled={updatingId === donation.id}
                              style={{ backgroundColor: '#9E1228', color: '#F3F0EC' }}
                            >
                              Tolak
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: '#F3F0EC' }}>
                            {donation.action_by && (
                              <>
                                <p>oleh {donation.action_by}</p>
                                <p>{donation.action_at ? formatDate(donation.action_at) : ''}</p>
                              </>
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, CheckCircle, XCircle, Clock, ExternalLink, Save, Settings, ReceiptText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  campaignStageLabels,
  defaultCampaignSettings,
  type CharityExpense,
  type CampaignSettings,
} from '@/lib/campaign-types'
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
  const [campaignSettings, setCampaignSettings] = useState<CampaignSettings>(defaultCampaignSettings)
  const [campaignWarning, setCampaignWarning] = useState('')
  const [savingCampaign, setSavingCampaign] = useState(false)
  const [expenses, setExpenses] = useState<CharityExpense[]>([])
  const [expenseWarning, setExpenseWarning] = useState('')
  const [savingExpense, setSavingExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: '',
    amount: '',
    spent_at: new Date().toISOString().slice(0, 10),
    proof_url: '',
    description: '',
  })
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
    fetchCampaignSettings(token)
    fetchExpenses(token)
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

  const fetchCampaignSettings = async (token: string) => {
    try {
      const response = await fetch('/api/admin/campaign', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCampaignSettings({
          ...defaultCampaignSettings,
          ...(data.settings || {}),
        })
        setCampaignWarning(data.warning || '')
      }
    } catch (error) {
      console.error('Error fetching campaign settings:', error)
    }
  }

  const updateCampaignField = <K extends keyof CampaignSettings>(
    field: K,
    value: CampaignSettings[K]
  ) => {
    setCampaignSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveCampaign = async () => {
    setSavingCampaign(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/campaign', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...campaignSettings,
          adminUsername,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCampaignSettings({
          ...defaultCampaignSettings,
          ...(data.settings || {}),
        })
        setCampaignWarning('')
        alert('Pengaturan campaign berhasil disimpan')
      } else {
        alert(data.error || 'Gagal menyimpan pengaturan campaign')
      }
    } catch (error) {
      console.error('Error saving campaign settings:', error)
      alert('Gagal menyimpan pengaturan campaign')
    } finally {
      setSavingCampaign(false)
    }
  }

  const fetchExpenses = async (token: string) => {
    try {
      const response = await fetch('/api/admin/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setExpenses(data.expenses || [])
        setExpenseWarning(data.warning || '')
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const handleAddExpense = async () => {
    if (!newExpense.title.trim() || !newExpense.amount) {
      alert('Judul dan nominal belanja wajib diisi')
      return
    }

    setSavingExpense(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExpense,
          amount: Number(newExpense.amount),
          adminUsername,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewExpense({
          title: '',
          category: '',
          amount: '',
          spent_at: new Date().toISOString().slice(0, 10),
          proof_url: '',
          description: '',
        })
        setExpenseWarning('')
        fetchExpenses(token)
      } else {
        alert(data.error || 'Gagal menambah catatan belanja')
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Gagal menambah catatan belanja')
    } finally {
      setSavingExpense(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Hapus catatan belanja ini?')) return

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Sesi telah berakhir')
        return
      }

      const response = await fetch('/api/admin/expenses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expenseId }),
      })

      if (response.ok) {
        fetchExpenses(token)
      } else {
        const data = await response.json()
        alert(data.error || 'Gagal menghapus catatan belanja')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Gagal menghapus catatan belanja')
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

        <Card className="mb-8 overflow-hidden" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
          <div className="p-6" style={{ borderColor: '#2A2527', borderBottomWidth: '1px' }}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6" style={{ color: '#FF5A1F' }} />
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#FF5A1F' }}>Pengaturan Campaign</h2>
                  <p className="text-sm" style={{ color: '#F3F0EC' }}>
                    Buka/tutup donasi dan tampilkan informasi kegiatan live.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSaveCampaign}
                disabled={savingCampaign}
                className="gap-2"
                style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
              >
                <Save className="w-4 h-4" />
                {savingCampaign ? 'Menyimpan...' : 'Simpan Campaign'}
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {campaignWarning && (
              <div className="rounded-lg border p-4 text-sm" style={{ borderColor: '#D88A1C', color: '#D88A1C', backgroundColor: '#2A2118' }}>
                {campaignWarning}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Status Donasi
                </label>
                <select
                  value={campaignSettings.donation_status}
                  onChange={(e) => updateCampaignField('donation_status', e.target.value as CampaignSettings['donation_status'])}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                >
                  <option value="open">Donasi Dibuka</option>
                  <option value="closed">Donasi Ditutup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Tahap Progress
                </label>
                <select
                  value={campaignSettings.progress_stage}
                  onChange={(e) => updateCampaignField('progress_stage', e.target.value as CampaignSettings['progress_stage'])}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                >
                  {Object.entries(campaignStageLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Target Donasi
                </label>
                <input
                  type="number"
                  min="0"
                  value={campaignSettings.target_amount}
                  onChange={(e) => updateCampaignField('target_amount', Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Judul Campaign
                </label>
                <input
                  type="text"
                  value={campaignSettings.campaign_title}
                  onChange={(e) => updateCampaignField('campaign_title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Nama Kegiatan
                </label>
                <input
                  type="text"
                  value={campaignSettings.event_name || ''}
                  onChange={(e) => updateCampaignField('event_name', e.target.value)}
                  placeholder="Contoh: Berbagi Paket Sembako"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  value={campaignSettings.event_date || ''}
                  onChange={(e) => updateCampaignField('event_date', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Lokasi Kegiatan
                </label>
                <input
                  type="text"
                  value={campaignSettings.event_location || ''}
                  onChange={(e) => updateCampaignField('event_location', e.target.value)}
                  placeholder="Contoh: Jakarta"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Deskripsi Kegiatan
                </label>
                <textarea
                  rows={4}
                  value={campaignSettings.event_description || ''}
                  onChange={(e) => updateCampaignField('event_description', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Catatan Progress
                </label>
                <textarea
                  rows={4}
                  value={campaignSettings.progress_note || ''}
                  onChange={(e) => updateCampaignField('progress_note', e.target.value)}
                  placeholder="Contoh: Dana sedang disiapkan untuk pembelian kebutuhan kegiatan."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-8 overflow-hidden" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
          <div className="p-6" style={{ borderColor: '#2A2527', borderBottomWidth: '1px' }}>
            <div className="flex items-center gap-3">
              <ReceiptText className="w-6 h-6" style={{ color: '#FF5A1F' }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#FF5A1F' }}>Transparansi Belanja</h2>
                <p className="text-sm" style={{ color: '#F3F0EC' }}>
                  Tambahkan catatan penggunaan dana charity kapan saja.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {expenseWarning && (
              <div className="rounded-lg border p-4 text-sm" style={{ borderColor: '#D88A1C', color: '#D88A1C', backgroundColor: '#2A2118' }}>
                {expenseWarning}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Judul Belanja
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Paket sembako"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Kategori
                </label>
                <input
                  type="text"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Logistik, transport, dokumentasi"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Nominal
                </label>
                <input
                  type="number"
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Tanggal Belanja
                </label>
                <input
                  type="date"
                  value={newExpense.spent_at}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, spent_at: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Link Bukti Belanja
                </label>
                <input
                  type="url"
                  value={newExpense.proof_url}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, proof_url: e.target.value }))}
                  placeholder="Opsional: link nota/foto bukti"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#FF5A1F' }}>
                  Catatan Belanja
                </label>
                <textarea
                  rows={3}
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Opsional: jelaskan barang/jasa yang dibeli dan kegunaannya."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527' }}
                />
              </div>
            </div>

            <Button
              onClick={handleAddExpense}
              disabled={savingExpense}
              style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
            >
              {savingExpense ? 'Menyimpan...' : 'Tambah Catatan Belanja'}
            </Button>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold" style={{ color: '#FF5A1F' }}>Catatan Belanja Saat Ini</h3>
              {expenses.length === 0 ? (
                <p style={{ color: '#F3F0EC' }}>Belum ada catatan belanja.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="rounded-lg border p-4"
                      style={{ backgroundColor: '#2A2527', borderColor: '#3A3537' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold" style={{ color: '#FF5A1F' }}>{expense.title}</p>
                          <p className="text-sm" style={{ color: '#F3F0EC' }}>
                            {formatCurrency(expense.amount)} - {new Date(expense.spent_at).toLocaleDateString('id-ID')}
                          </p>
                          {expense.category && (
                            <p className="text-xs mt-1" style={{ color: '#D88A1C' }}>{expense.category}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="gap-2 bg-transparent"
                          style={{ color: '#F3F0EC', borderColor: '#9E1228' }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </div>
                      {expense.description && (
                        <p className="mt-3 text-sm" style={{ color: '#F3F0EC' }}>{expense.description}</p>
                      )}
                      {expense.proof_url && (
                        <a
                          href={expense.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: '#FF5A1F' }}
                        >
                          Lihat bukti
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

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

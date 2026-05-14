'use client'

import Link from "next/link"
import Image from "next/image"
import { Heart } from 'lucide-react' // Import Heart here

import React from "react"
import { useState } from 'react'
import { CheckCircle, AlertCircle, Upload, DollarSign, User, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MobileNav } from '@/components/mobile-nav'

export default function Donate() {
  const [formData, setFormData] = useState({
    name: '',
    discordUsername: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    message: '',
    isAnonymous: false,
  })

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')

  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar. Maksimal 5MB.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage('Format tidak didukung. Gunakan JPG, PNG, atau PDF.')
      return
    }

    setFile(selectedFile)
    setErrorMessage('')

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    processFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const uploadFile = async (fileToUpload: File): Promise<string> => {
    const formDataObj = new FormData()
    formDataObj.append('file', fileToUpload)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataObj,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Gagal mengunggah bukti donasi')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    setUploadProgress(0)

    try {
      // If not anonymous, name is required
      if (!formData.isAnonymous && !formData.name) {
        throw new Error('Mohon lengkapi nama atau pilih donasi anonim')
      }

      if (!formData.amount) {
        throw new Error('Mohon masukkan nominal donasi')
      }

      if (!file) {
        throw new Error('Mohon unggah bukti transfer donasi')
      }

      const amountNum = parseInt(formData.amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Nominal donasi tidak valid')
      }

      setUploadProgress(40)
      const proofUrl = await uploadFile(file)

      setUploadProgress(70)
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: amountNum,
          proofUrl,
          // Use "Anonim" as name if anonymous, otherwise use provided name
          name: formData.isAnonymous ? 'Anonim' : formData.name,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gagal mengirim data donasi')
      }

      setUploadProgress(100)
      setSuccessMessage(
        'Terima kasih 🙏 Donasi kamu berhasil dikirim dan sedang menunggu verifikasi admin Devilish Community.'
      )

      setFormData({
        name: '',
        discordUsername: '',
        amount: '',
        paymentMethod: 'bank_transfer',
        message: '',
        isAnonymous: false,
      })
      setFile(null)
      setFilePreview('')

      setTimeout(() => setSuccessMessage(''), 6000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div style={{ backgroundColor: '#0D0A0B' }} className="min-h-screen">
      {/* Navigation */}
      <MobileNav />

      {/* Content */}
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#FF5A1F' }}>Form Konfirmasi Donasi</h1>
        <p className="mb-8" style={{ color: '#F3F0EC' }}>
          Silakan isi form ini setelah melakukan transfer donasi. Setiap donasi akan diverifikasi secara manual oleh tim admin kami.
        </p>

        {successMessage && (
          <Card className="p-4 mb-6 flex gap-3" style={{ backgroundColor: '#1A2723', borderColor: '#6E0F1F', borderWidth: '1px' }}>
            <CheckCircle style={{ color: '#FF5A1F' }} />
            <p className="text-sm" style={{ color: '#FF5A1F' }}>{successMessage}</p>
          </Card>
        )}

        {errorMessage && (
          <Card className="p-4 mb-6 flex gap-3" style={{ backgroundColor: '#3D1F1F', borderColor: '#FF5A1F', borderWidth: '1px' }}>
            <AlertCircle style={{ color: '#FF5A1F' }} />
            <p className="text-sm" style={{ color: '#FF5A1F' }}>{errorMessage}</p>
          </Card>
        )}

        {/* Bank Information Card */}
        <Card className="p-8 mb-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1A1517', borderColor: '#2A2527' }}>
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
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FF5A1F' }}>
                Informasi Rekening Bank
              </h3>
              <div className="space-y-3" style={{ color: '#F3F0EC' }}>
                <div>
                  <p className="text-sm" style={{ color: '#D88A1C' }}>Bank</p>
                  <p className="font-semibold">SMBC (Sumitomo Mitsui Banking Corporation)</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#D88A1C' }}>Nomor Rekening</p>
                  <p className="font-semibold font-mono text-lg">90012331247</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#D88A1C' }}>Atas Nama (a.n.)</p>
                  <p className="font-semibold">Ahmad Fadillah Ruswansyah</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-lg" style={{ backgroundColor: '#1A1517' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Donation Checkbox */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer" style={{ color: '#F3F0EC' }}>
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#FF5A1F' }}
                />
                <span className="text-sm font-semibold">Donasi Anonim (Nama tidak akan ditampilkan)</span>
              </label>
              <p className="text-xs" style={{ color: '#D88A1C' }}>
                ✓ Centang untuk mendonasi secara anonim tanpa menampilkan identitas Anda
              </p>
            </div>

            {/* Nama */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: '#FF5A1F' }}>
                  <User className="w-4 h-4" style={{ color: '#D88A1C' }} />
                  Nama Lengkap <span style={{ color: '#FF5A1F' }}>*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama Anda"
                  className="border-slate-300 focus:ring-2 focus:ring-offset-0"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
                />
              </div>
            )}

            {/* Username Discord */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: '#FF5A1F' }}>
                  Username Discord <span className="font-normal" style={{ color: '#F3F0EC' }}>(opsional)</span>
                </label>
                <Input
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  placeholder="Nama Discord Anda"
                  className="border-slate-300 focus:ring-2 focus:ring-offset-0"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
                />
              </div>
            )}

            {/* Nominal Donasi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: '#FF5A1F' }}>
                <DollarSign className="w-4 h-4" style={{ color: '#D88A1C' }} />
                Nominal Donasi <span style={{ color: '#FF5A1F' }}>*</span>
              </label>
              <div className="flex items-center gap-2">
                <span style={{ color: '#F3F0EC' }}>Rp</span>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Contoh: 50000"
                  className="border-slate-300 focus:ring-2 focus:ring-offset-0"
                  style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
                />
              </div>
            </div>

            {/* Pesan */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: '#FF5A1F' }}>
                <MessageSquare className="w-4 h-4" style={{ color: '#D88A1C' }} />
                Pesan/Doa <span className="font-normal" style={{ color: '#F3F0EC' }}>(opsional)</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tulis pesan, doa, atau harapan Anda..."
                rows={3}
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ backgroundColor: '#0D0A0B', color: '#F3F0EC', borderColor: '#2A2527', '--tw-ring-color': '#FF5A1F' } as any}
              />
            </div>

            {/* Bukti Transfer */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2" style={{ color: '#FF5A1F' }}>
                <Upload className="w-4 h-4" style={{ color: '#D88A1C' }} />
                Bukti Transfer <span style={{ color: '#FF5A1F' }}>*</span>
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition"
                style={{ borderColor: '#2A2527' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF5A1F';
                  e.currentTarget.style.backgroundColor = '#1A1517';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2A2527';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <label htmlFor="fileInput" className="cursor-pointer block">
                  {filePreview ? (
                    <div className="space-y-3">
                      <img src={filePreview || "/placeholder.svg"} alt="Preview" className="w-24 h-24 mx-auto rounded-lg object-cover" style={{ borderColor: '#FF5A1F', borderWidth: '2px' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#FF5A1F' }}>{file?.name}</p>
                        <p className="text-xs" style={{ color: '#F3F0EC' }}>{(file?.size || 0) / 1024} KB</p>
                      </div>
                    </div>
                  )                   : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF5A1F' }} />
                      <p className="text-sm font-medium" style={{ color: '#FF5A1F' }}>Klik untuk upload atau drag & drop</p>
                      <p className="text-xs mt-1" style={{ color: '#F3F0EC' }}>JPG, PNG, atau PDF (Maks 5MB)</p>
                    </>
                  )}
                </label>
              </div>
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setFilePreview('')
                  }}
                  className="text-sm font-medium"
                  style={{ color: '#FF5A1F' }}
                >
                  ✕ Ganti file
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 text-center">{uploadProgress}%</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              disabled={isLoading} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition " style={{ backgroundColor: '#FF5A1F', color: '#F3F0EC' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"  />
                  Memproses...
                </div>
              ) : (
                'Kirim Konfirmasi Donasi'
              )}
            </Button>
          </form>
        </Card>
      </div>

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

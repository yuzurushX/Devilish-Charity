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
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

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
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Form <span className="text-primary">Donasi</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Silakan isi form ini setelah melakukan transfer donasi. Setiap donasi akan diverifikasi secara manual oleh tim admin kami.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto max-w-2xl py-12 px-4">

        {successMessage && (
          <Card className="p-4 mb-6 flex gap-3 bg-card/50 backdrop-blur-sm border border-primary/20">
            <CheckCircle className="text-primary" />
            <p className="text-sm text-primary">{successMessage}</p>
          </Card>
        )}

        {errorMessage && (
          <Card className="p-4 mb-6 flex gap-3 bg-card/50 backdrop-blur-sm border border-destructive/30">
            <AlertCircle className="text-destructive" />
            <p className="text-sm text-destructive">{errorMessage}</p>
          </Card>
        )}

        {/* Bank Information Card */}
        <Card className="p-8 mb-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40">
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
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Informasi Rekening Bank
              </h3>
              <div className="space-y-3 text-foreground">
                <div>
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="font-semibold">SMBC (Sumitomo Mitsui Banking Corporation)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                  <p className="font-semibold font-mono text-lg">90012331247</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atas Nama (a.n.)</p>
                  <p className="font-semibold">Ahmad Fadillah Ruswansyah</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-lg bg-card/50 backdrop-blur-sm border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Donation Checkbox */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm font-semibold">Donasi Anonim (Nama tidak akan ditampilkan)</span>
              </label>
              <p className="text-xs text-muted-foreground">
                ✓ Centang untuk mendonasi secara anonim tanpa menampilkan identitas Anda
              </p>
            </div>

            {/* Nama */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nama Lengkap <span className="text-primary">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama Anda"
                  className="bg-background text-foreground border-border focus:ring-2 focus:ring-offset-0"
                  style={{ '--tw-ring-color': 'var(--accent)' } as any}
                />
              </div>
            )}

            {/* Username Discord */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  Username Discord <span className="font-normal text-foreground">(opsional)</span>
                </label>
                <Input
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  placeholder="Nama Discord Anda"
                  className="bg-background text-foreground border-border focus:ring-2 focus:ring-offset-0"
                  style={{ '--tw-ring-color': 'var(--accent)' } as any}
                />
              </div>
            )}

            {/* Nominal Donasi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Nominal Donasi <span className="text-primary">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-foreground">Rp</span>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Contoh: 50000"
                  className="bg-background text-foreground border-border focus:ring-2 focus:ring-offset-0"
                  style={{ '--tw-ring-color': 'var(--accent)' } as any}
                />
              </div>
            </div>

            {/* Pesan */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Pesan/Doa <span className="font-normal text-foreground">(opsional)</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tulis pesan, doa, atau harapan Anda..."
                rows={3}
                className="w-full bg-background text-foreground border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ '--tw-ring-color': 'var(--accent)' } as any}
              />
            </div>

            {/* Bukti Transfer */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <Upload className="w-4 h-4 text-muted-foreground" />
                Bukti Transfer <span className="text-primary">*</span>
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgb(255 255 255 / 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary) / 0.3';
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
                      <img src={filePreview || "/placeholder.svg"} alt="Preview" className="w-24 h-24 mx-auto rounded-lg object-cover border-2 border-primary/40" />
                      <div>
                        <p className="text-sm font-medium text-primary">{file?.name}</p>
                        <p className="text-xs text-muted-foreground">{(file?.size || 0) / 1024} KB</p>
                      </div>
                    </div>
                  )                   : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary/60" />
                      <p className="text-sm font-medium text-foreground">Klik untuk upload atau drag & drop</p>
                      <p className="text-xs mt-1 text-muted-foreground">JPG, PNG, atau PDF (Maks 5MB)</p>
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
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  ✕ Ganti file
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              disabled={isLoading} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition"
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

      <Footer />
    </div>
  )
}

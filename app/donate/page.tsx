'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import {
  CheckCircle,
  AlertCircle,
  Upload,
  DollarSign,
  User,
  MessageSquare,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

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
  const [filePreview, setFilePreview] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [modal, setModal] = useState({
    open: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  })

  const bankAccounts = [
    {
      bank: 'SMBC (Sumitomo Mitsui Banking Corporation)',
      accountNumber: '90012331247',
      accountName: 'Ahmad Fadillah Ruswansyah',
      logo: '/smbc-logo.png',
    },
    {
      bank: 'Mandiri',
      accountNumber: '4616 9912 2306 9855',
      accountName: 'Maha Dewi Putri',
      logo: '/mandiri-logo.png',
    },
  ]

  const showError = (message: string) => {
    setModal({
      open: true,
      type: 'error',
      title: 'Terjadi Kesalahan',
      message,
    })
  }

  const showSuccess = (message: string) => {
    setModal({
      open: true,
      type: 'success',
      title: 'Donasi Berhasil Dikirim',
      message,
    })
  }

  const formatRupiah = (value: string) => {
    const numbers = value.replace(/\D/g, '')

    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

    // remove everything except numbers
    const numericValue = rawValue.replace(/\D/g, '')

    setFormData((prev) => ({
      ...prev,
      amount: formatRupiah(numericValue),
    }))
  }

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      showError('Ukuran file terlalu besar. Maksimal 5MB.')
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      showError('Format tidak didukung. Gunakan JPG, PNG, atau PDF.')
      return
    }

    setFile(selectedFile)

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = (e) =>
        setFilePreview(e.target?.result as string)

      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview('')
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    processFile(selectedFile)
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const uploadFile = async (
    fileToUpload: File
  ): Promise<string> => {
    const formDataObj = new FormData()

    formDataObj.append('file', fileToUpload)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataObj,
    })

    if (!response.ok) {
      const error = await response.json()

      throw new Error(
        error.error || 'Gagal mengunggah bukti donasi'
      )
    }

    const data = await response.json()

    return data.url
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setIsLoading(true)
    setUploadProgress(0)

    try {
      if (!formData.isAnonymous && !formData.name) {
        throw new Error(
          'Mohon lengkapi nama atau pilih donasi anonim'
        )
      }

      if (!formData.amount) {
        throw new Error('Mohon masukkan nominal donasi')
      }

      if (!file) {
        throw new Error(
          'Mohon unggah bukti transfer donasi'
        )
      }

      const amountNum = parseInt(
        formData.amount.replace(/\./g, '')
      )

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Nominal donasi tidak valid')
      }

      setUploadProgress(40)

      const proofUrl = await uploadFile(file)

      setUploadProgress(70)

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: amountNum,
          proofUrl,
          name: formData.isAnonymous
            ? 'Anonim'
            : formData.name,
        }),
      })

      if (!response.ok) {
        const error = await response.json()

        throw new Error(
          error.error || 'Gagal mengirim data donasi'
        )
      }

      setUploadProgress(100)

      showSuccess(
        'Terima kasih 🙏 Donasi berhasil dikirim dan sedang menunggu verifikasi admin (maks. 1x24 jam). Setelah terverifikasi, donasi anda akan muncul di halaman transparansi.'
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
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan'
      )
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Form <span className="text-primary">Donasi</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Silakan isi form ini setelah melakukan transfer
              donasi.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl py-12 px-4">
        <div className="space-y-6 mb-8">
          {bankAccounts.map((account, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40"
            >
              <div className="flex gap-6">
                <div className="flex items-center justify-center h-20 w-32 rounded-md flex-shrink-0">
                  <Image
                    src={account.logo}
                    alt={`${account.bank} Logo`}
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
                      <p className="text-sm text-muted-foreground">
                        Bank
                      </p>

                      <p className="font-semibold">
                        {account.bank}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nomor Rekening
                      </p>

                      <p className="font-semibold font-mono text-lg">
                        {account.accountNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Atas Nama (a.n.)
                      </p>

                      <p className="font-semibold">
                        {account.accountName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 shadow-lg bg-card/50 backdrop-blur-sm border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Anonymous */}
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

                <span className="text-sm font-semibold">
                  Donasi Anonim
                </span>
              </label>

              <p className="text-xs text-muted-foreground">
                ✓ Centang untuk mendonasi secara anonim
              </p>
            </div>

            {/* Nama */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nama
                </label>

                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama Anda"
                />
              </div>
            )}

            {/* Discord */}
            {!formData.isAnonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  Username Discord
                </label>

                <Input
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  placeholder="Nama Discord Anda"
                />
              </div>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Nominal Donasi
              </label>

              <div className="flex items-center gap-2">
                <span>Rp</span>

                <Input
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder="50.000"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Pesan / Doa
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Pesan atau doa..."
                className="w-full bg-background text-foreground border border-border rounded-lg p-3 text-sm"
              />
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold flex items-center gap-2 text-primary">
                <Upload className="w-4 h-4 text-muted-foreground" />
                Bukti Transfer
              </label>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 text-center"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept=".jpg,.jpeg,.png,.pdf"
                />

                <label
                  htmlFor="fileInput"
                  className="cursor-pointer block"
                >
                  {filePreview ? (
                    <div className="space-y-3">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-24 h-24 mx-auto rounded-lg object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {file?.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary/60" />

                      <p className="text-sm font-medium">
                        Klik untuk upload
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Progress */}
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              disabled={isLoading}
              className="w-full"
            >
              {isLoading
                ? 'Memproses...'
                : 'Kirim Konfirmasi Donasi'}
            </Button>
          </form>
        </Card>
      </div>

      {/* Modal */}
      <Dialog
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({
            ...prev,
            open,
          }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {modal.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}

              <DialogTitle>{modal.title}</DialogTitle>
            </div>

            <DialogDescription className="pt-2">
              {modal.message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
              className="w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

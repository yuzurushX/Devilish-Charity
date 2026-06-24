'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

import {
  CheckCircle,
  AlertCircle,
  Upload,
  DollarSign,
  User,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CampaignStatusPanel } from '@/components/campaign-status-panel'
import { PosterDecorations } from '@/components/poster-decorations'
import { useCampaignSummary } from '@/hooks/use-campaign-summary'

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
  const { campaign } = useCampaignSummary()
  const isDonationClosed = campaign.settings.donation_status === 'closed'

  const [formData, setFormData] = useState({
    name: '',
    discordUsername: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    message: '',
    isAnonymous: false,
    selectedRekening: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [copiedAccount, setCopiedAccount] = useState('')

  const [modal, setModal] = useState({
    open: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  })

  const bankAccounts = [
    {
      id: 'smbc',
      bank: 'SMBC (Sumitomo Mitsui Banking Corporation)',
      accountNumber: '90012331247',
      accountName: 'Ahmad Fadillah Ruswansyah',
      logo: '/smbc-logo.png',
      discordMentionId: '1419903183542681704',
    },
    {
      id: 'mandiri',
      bank: 'Mandiri',
      accountNumber: '4616 9912 2306 9855',
      accountName: 'Maha Dewi Putri',
      logo: '/mandiri-logo.png',
      discordMentionId: '758367171427827724',
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

  const handleCopy = async (text: string) => {
    try {
      // remove spaces before copying
      const cleanedText = text.replace(/\s/g, '')

      await navigator.clipboard.writeText(cleanedText)

      setCopiedAccount(text)

      setTimeout(() => {
        setCopiedAccount('')
      }, 2000)
    } catch {
      showError('Gagal menyalin nomor rekening')
    }
  }

  const formatRupiah = (value: string) => {
    const numbers = value.replace(/\D/g, '')

    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

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

    if (isDonationClosed) {
      showError('Donasi sedang ditutup untuk saat ini.')
      return
    }

    setIsLoading(true)
    setUploadProgress(0)

    try {
      if (!formData.selectedRekening) {
        throw new Error('Mohon pilih rekening tujuan transfer')
      }

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
          selectedRekening: formData.selectedRekening,
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
        'Terima kasih. Donasi berhasil dikirim dan sedang menunggu verifikasi admin (maks. 1x24 jam). Setelah terverifikasi, donasi anda akan muncul di halaman transparansi.'
      )

      setFormData({
        name: '',
        discordUsername: '',
        amount: '',
        paymentMethod: 'bank_transfer',
        message: '',
        isAnonymous: false,
        selectedRekening: '',
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
        <PosterDecorations compact />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 text-foreground tracking-normal">
              Form <span className="text-primary">Donasi</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed text-balance">
              Silakan isi form ini setelah melakukan transfer
              donasi.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl pt-12 px-4">
        <CampaignStatusPanel showAction={false} />
      </div>

      <div className="container mx-auto max-w-2xl py-12 px-4">
        {isDonationClosed ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border border-primary/20">
              <AlertCircle className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-3 tracking-normal">
                Form Donasi Sedang Ditutup
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Campaign ini sudah tidak menerima konfirmasi donasi baru.
                Silakan pantau halaman transparansi untuk progres kegiatan,
                penyaluran, dan dokumentasi terbaru.
              </p>
            </Card>
          </motion.div>
        ) : null}

        <div className={isDonationClosed ? 'hidden' : ''}>
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">
              Pilih Rekening Tujuan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Pilih salah satu rekening di bawah ini untuk transfer donasi Anda.
            </p>
          </div>

          {bankAccounts.map((account, index) => {
            const isSelected = formData.selectedRekening === account.id
            return (
              <motion.button
                key={index}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedRekening: account.id,
                  }))
                }
                className={`w-full text-left transition-all rounded-lg border-2 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <Card
                  className={`p-8 transition-shadow border-0 rounded-lg bg-card/50 backdrop-blur-sm ${
                    isSelected ? 'shadow-lg' : 'hover:shadow-md'
                  }`}
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
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-primary">
                          Informasi Rekening Bank
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 text-foreground">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Bank
                          </p>
                          <p className="font-semibold">{account.bank}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Nomor Rekening
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold font-mono text-lg">
                              {account.accountNumber}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopy(account.accountNumber)
                              }}
                              className="p-1 rounded-md hover:bg-primary/10 transition-colors"
                            >
                              {copiedAccount === account.accountNumber ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Atas Nama (a.n.)
                          </p>
                          <p className="font-semibold">{account.accountName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.button>
            )
          })}
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
                Centang untuk mendonasi secara anonim
              </p>
            </div>

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

            <Button
              disabled={isLoading || isDonationClosed}
              className="w-full"
            >
              {isLoading
                ? 'Memproses...'
                : 'Kirim Konfirmasi Donasi'}
            </Button>
          </form>
        </Card>
        </div>
      </div>

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

"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  FileText, 
  Plus, 
  X, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ContractAttachments } from '@/components/contracts/contract-attachments'
import { FilePreview } from '@/components/contracts/file-preview'

interface ContractParty {
  user_id: string
  role: 'client' | 'artist' | 'venue'
  signed: boolean
  signed_at: string | null
}

interface ContractAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

interface Contract {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled'
  terms: { text: string }
  payment_terms: {
    amount: number
    currency: string
    schedule: 'one_time' | 'weekly' | 'monthly'
    due_date: string
  }
  parties: ContractParty[]
  attachments: ContractAttachment[]
}

export default function EditContractPage() {
  const params = useParams()
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [removedAttachments, setRemovedAttachments] = useState<string[]>([])
  const [previewFile, setPreviewFile] = useState<{
    name: string
    url: string
    type: string
  } | null>(null)

  useEffect(() => {
    fetchContract()
  }, [params.id])

  const fetchContract = async () => {
    try {
      const res = await fetch(`/api/contracts/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch contract')
      const data = await res.json()
      setContract(data)
    } catch (error) {
      toast.error('Failed to load contract')
      router.push('/dashboard/contracts')
    } finally {
      setLoading(false)
    }
  }

  const handleAddParty = () => {
    if (!contract) return
    setContract({
      ...contract,
      parties: [...contract.parties, { user_id: '', role: 'client', signed: false, signed_at: null }]
    })
  }

  const handleRemoveParty = (index: number) => {
    if (!contract) return
    setContract({
      ...contract,
      parties: contract.parties.filter((_, i) => i !== index)
    })
  }

  const handlePartyChange = (index: number, field: keyof ContractParty, value: string) => {
    if (!contract) return
    const updatedParties = [...contract.parties]
    updatedParties[index] = { ...updatedParties[index], [field]: value }
    setContract({ ...contract, parties: updatedParties })
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments(Array.from(e.target.files))
    }
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!contract) return
    setRemovedAttachments([...removedAttachments, attachmentId])
    setContract({
      ...contract,
      attachments: contract.attachments.filter(a => a.id !== attachmentId)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract) return

    setSaving(true)
    try {
      // First, handle file uploads
      const uploadedAttachments = await Promise.all(
        newAttachments.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          if (!res.ok) throw new Error('Failed to upload file')
          return res.json()
        })
      )

      // Prepare contract data
      const contractData = {
        ...contract,
        attachments: [
          ...contract.attachments.filter(a => !removedAttachments.includes(a.id)),
          ...uploadedAttachments
        ]
      }

      // Update contract
      const res = await fetch(`/api/contracts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData)
      })

      if (!res.ok) throw new Error('Failed to update contract')
      
      toast.success('Contract updated successfully')
      router.push(`/dashboard/contracts/${params.id}`)
    } catch (error) {
      toast.error('Failed to update contract')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-8">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p>Contract not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={contract.title}
                onChange={e => setContract({ ...contract, title: e.target.value })}
                required
                maxLength={100}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={contract.description}
                onChange={e => setContract({ ...contract, description: e.target.value })}
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={format(new Date(contract.start_date), 'yyyy-MM-dd')}
                  onChange={e => setContract({ ...contract, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={format(new Date(contract.end_date), 'yyyy-MM-dd')}
                  onChange={e => setContract({ ...contract, end_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Parties</Label>
              {contract.parties.map((party, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <Input
                    placeholder="User ID"
                    value={party.user_id}
                    onChange={e => handlePartyChange(index, 'user_id', e.target.value)}
                    required
                  />
                  <select
                    value={party.role}
                    onChange={e => handlePartyChange(index, 'role', e.target.value as 'client' | 'artist' | 'venue')}
                    className="border rounded px-2 py-1"
                  >
                    <option value="client">Client</option>
                    <option value="artist">Artist</option>
                    <option value="venue">Venue</option>
                  </select>
                  {!party.signed && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveParty(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddParty}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Party
              </Button>
            </div>

            <div>
              <Label>Payment Terms</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={contract.payment_terms.amount}
                    onChange={e => setContract({
                      ...contract,
                      payment_terms: {
                        ...contract.payment_terms,
                        amount: Number(e.target.value)
                      }
                    })}
                    min={0}
                    required
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input
                    value={contract.payment_terms.currency}
                    onChange={e => setContract({
                      ...contract,
                      payment_terms: {
                        ...contract.payment_terms,
                        currency: e.target.value
                      }
                    })}
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <Label>Schedule</Label>
                  <select
                    value={contract.payment_terms.schedule}
                    onChange={e => setContract({
                      ...contract,
                      payment_terms: {
                        ...contract.payment_terms,
                        schedule: e.target.value as 'one_time' | 'weekly' | 'monthly'
                      }
                    })}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="one_time">One Time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={contract.payment_terms.due_date ? format(new Date(contract.payment_terms.due_date), 'yyyy-MM-dd') : ''}
                    onChange={e => setContract({
                      ...contract,
                      payment_terms: {
                        ...contract.payment_terms,
                        due_date: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Terms</Label>
              <Textarea
                value={contract.terms.text}
                onChange={e => setContract({
                  ...contract,
                  terms: { text: e.target.value }
                })}
                rows={4}
              />
            </div>

            <div>
              <Label>Attachments</Label>
              <ContractAttachments
                attachments={contract.attachments}
                onAttachmentsChange={(newAttachments) => {
                  setContract({
                    ...contract,
                    attachments: newAttachments
                  })
                }}
                onAttachmentDelete={(attachmentId) => {
                  setContract({
                    ...contract,
                    attachments: contract.attachments.filter(a => a.id !== attachmentId)
                  })
                }}
                disabled={contract.status !== 'draft'}
              />
            </div>

            {previewFile && (
              <FilePreview
                file={previewFile}
                onClose={() => setPreviewFile(null)}
              />
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/contracts/${params.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
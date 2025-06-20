"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { format } from 'date-fns'

const defaultParty = { user_id: '', role: 'client' as 'client' | 'artist' | 'venue' }
const defaultPayment = { amount: 0, currency: 'USD', schedule: 'one_time' as 'one_time' | 'weekly' | 'monthly', due_date: '' }

export default function NewContractPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [parties, setParties] = useState([{ ...defaultParty }])
  const [payment, setPayment] = useState({ ...defaultPayment })
  const [terms, setTerms] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleAddParty = () => setParties([...parties, { ...defaultParty }])
  const handlePartyChange = (idx: number, key: string, value: string) => {
    setParties(parties.map((p, i) => (i === idx ? { ...p, [key]: value } : p)))
  }
  const handleRemoveParty = (idx: number) => setParties(parties.filter((_, i) => i !== idx))

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const contract = {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status: 'draft',
        terms: { text: terms },
        payment_terms: payment,
        parties,
        attachments: attachments.map((file) => ({
          name: file.name,
          url: '', // Upload logic needed
          type: file.type,
          size: file.size,
        })),
      }
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract),
      })
      if (!res.ok) throw new Error('Failed to create contract')
      toast.success('Contract created!')
      router.push('/dashboard/contracts')
    } catch (error) {
      toast.error('Failed to create contract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div className="flex-1">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Parties</Label>
              {parties.map((party, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <Input
                    placeholder="User ID"
                    value={party.user_id}
                    onChange={e => handlePartyChange(idx, 'user_id', e.target.value)}
                    required
                  />
                  <select
                    value={party.role}
                    onChange={e => handlePartyChange(idx, 'role', e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="client">Client</option>
                    <option value="artist">Artist</option>
                    <option value="venue">Venue</option>
                  </select>
                  {parties.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => handleRemoveParty(idx)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddParty} className="mt-2">
                Add Party
              </Button>
            </div>
            <div>
              <Label>Payment Terms</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={payment.amount}
                  onChange={e => setPayment({ ...payment, amount: Number(e.target.value) })}
                  min={0}
                  required
                />
                <Input
                  placeholder="Currency"
                  value={payment.currency}
                  onChange={e => setPayment({ ...payment, currency: e.target.value })}
                  maxLength={6}
                  required
                />
                <select
                  value={payment.schedule}
                  onChange={e => setPayment({ ...payment, schedule: e.target.value as any })}
                  className="border rounded px-2 py-1"
                >
                  <option value="one_time">One Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <Input
                  type="date"
                  value={payment.due_date}
                  onChange={e => setPayment({ ...payment, due_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Terms</Label>
              <Textarea value={terms} onChange={e => setTerms(e.target.value)} rows={4} />
            </div>
            <div>
              <Label>Attachments</Label>
              <Input type="file" multiple onChange={handleAttachmentChange} />
              {attachments.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                  {attachments.map((file, i) => (
                    <li key={i}>{file.name} ({file.size} bytes)</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Contract'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  FileText, 
  Download, 
  Edit, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  History,
  Printer,
  FileEdit
} from 'lucide-react'
import { ContractAnalytics } from '@/components/contracts/contract-analytics'
import { ContractExport } from '@/components/contracts/contract-export'

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

interface ContractHistory {
  id: string
  action: string
  details: string
  user_id: string
  created_at: string
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
  history: ContractHistory[]
  created_at: string
  updated_at: string
}

export default function ContractDetailsPage() {
  const params = useParams()
  const contractId = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchContract()
  }, [contractId])

  const fetchContract = async () => {
    try {
      const res = await fetch(`/api/contracts/${contractId}`)
      if (!res.ok) throw new Error('Failed to fetch contract')
      const data = await res.json()
      setContract(data)
    } catch (error) {
      toast.error('Failed to load contract')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/sign`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to sign contract')
      await fetchContract()
      toast.success('Contract signed successfully')
    } catch (error) {
      toast.error('Failed to sign contract')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this contract?')) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/cancel`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to cancel contract')
      await fetchContract()
      toast.success('Contract cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel contract')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownload = async (attachment: ContractAttachment) => {
    try {
      const res = await fetch(attachment.url)
      if (!res.ok) throw new Error('Failed to download attachment')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Failed to download attachment')
    }
  }

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (!contract) {
    return <div className="container mx-auto py-8">Contract not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'pending': return 'bg-yellow-500'
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500' // Using blue for completed as 'success' is not a direct variant
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const artistParty = contract?.parties.find(p => p.role === 'artist')
  const venueParty = contract?.parties.find(p => p.role === 'venue')

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{contract?.title}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(contract?.created_at || ''), 'PPP')}
          </p>
        </div>
        <div className="flex gap-4">
          <ContractExport contractId={contractId} />
          <Button
            variant="outline"
            onClick={() => {
              // Track view action
              fetch(`/api/contracts/${contractId}/analytics`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'view' })
              })
              window.print()
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Track download action
              fetch(`/api/contracts/${contractId}/analytics`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'download' })
              })
              window.open(`/api/contracts/${contractId}/download`, '_blank')
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          {contract?.status === 'draft' && (
            <Button
              onClick={() => {
                router.push(`/dashboard/contracts/${contractId}/edit`)
              }}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Contract
            </Button>
          )}
          {contract?.status === 'pending' && !artistParty?.signed && (
            <Button
              onClick={handleSign}
              disabled={actionLoading}
            >
              {actionLoading ? 'Signing...' : 'Sign Contract'}
            </Button>
          )}
          {(contract?.status === 'pending' || contract?.status === 'active') && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              {actionLoading ? 'Cancelling...' : 'Cancel Contract'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Status
                  </dt>
                  <dd>
                    <Badge
                      variant={
                        contract?.status === 'active'
                          ? 'default'
                          : contract?.status === 'completed'
                          ? 'default' // Changed from 'success' to 'default'
                          : contract?.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {contract?.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </dt>
                  <dd>
                    {contract?.payment_terms.amount}{' '}
                    {contract?.payment_terms.currency.toUpperCase()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Payment Schedule
                  </dt>
                  <dd>{contract?.payment_terms.schedule}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </dt>
                  <dd>
                    {contract?.payment_terms.due_date
                      ? format(new Date(contract.payment_terms.due_date), 'PPP')
                      : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </dt>
                  <dd>{format(new Date(contract?.start_date || ''), 'PPP')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    End Date
                  </dt>
                  <dd>{format(new Date(contract?.end_date || ''), 'PPP')}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parties Involved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {artistParty && (
                  <div>
                    <h3 className="font-semibold">Artist:</h3>
                    <p>User ID: {artistParty.user_id}</p>
                    <p>
                      Status:{' '}
                      <Badge
                        variant={artistParty.signed ? 'default' : 'secondary'} // Use default for signed, secondary for not signed
                      >
                        {artistParty.signed ? 'Signed' : 'Pending Signature'}
                      </Badge>
                    </p>
                    {artistParty.signed_at && (
                      <p className="text-sm text-muted-foreground">
                        Signed on {format(new Date(artistParty.signed_at), 'PPP')}
                      </p>
                    )}
                  </div>
                )}
                {venueParty && (
                  <div>
                    <h3 className="font-semibold">Venue:</h3>
                    <p>User ID: {venueParty.user_id}</p>
                    <p>
                      Status:{' '}
                      <Badge
                        variant={venueParty.signed ? 'default' : 'secondary'} // Use default for signed, secondary for not signed
                      >
                        {venueParty.signed ? 'Signed' : 'Pending Signature'}
                      </Badge>
                    </p>
                    {venueParty.signed_at && (
                      <p className="text-sm text-muted-foreground">
                        Signed on {format(new Date(venueParty.signed_at), 'PPP')}
                      </p>
                    )}
                  </div>
                )}
                {contract?.parties.length === 0 && (
                  <p className="text-muted-foreground">No parties defined for this contract.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{contract?.terms.text}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {contract?.attachments && contract.attachments.length > 0 ? (
                <ul className="space-y-2">
                  {contract.attachments.map((attachment) => (
                    <li key={attachment.id} className="flex items-center justify-between">
                      <span className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {attachment.name} ({Math.round(attachment.size / 1024)} KB)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(attachment)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No attachments for this contract.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract History</CardTitle>
            </CardHeader>
            <CardContent>
              {contract?.history && contract.history.length > 0 ? (
                <ul className="space-y-4">
                  {contract.history.map((entry) => (
                    <li key={entry.id} className="border-l-2 pl-4">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.created_at), 'PPP p')} by User {entry.user_id}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No history for this contract.</p>
              )}
            </CardContent>
          </Card>
          
          <div>
            <ContractAnalytics contractId={contractId} />
          </div>
        </div>
      </div>
    </div>
  )
}
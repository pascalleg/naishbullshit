import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { InvoiceService } from '@/lib/services/invoice-service'
import { format } from 'date-fns'

interface Invoice {
  id: string
  booking_id: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  created_at: string
}

interface InvoiceListProps {
  userId: string
}

export function InvoiceList({ userId }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [userId])

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/invoices')
      if (!response.ok) {
        throw new Error('Failed to load invoices')
      }
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`)
      if (!response.ok) {
        throw new Error('Failed to download invoice')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-500 border-none">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-none">Pending</Badge>
      case 'overdue':
        return <Badge className="bg-red-500/20 text-red-500 border-none">Overdue</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-500 border-none">Cancelled</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-500 border-none">Draft</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No invoices found
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Invoices</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">Invoice #{invoice.id.slice(0, 8)}</h3>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(invoice.due_date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {format(new Date(invoice.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency,
                  }).format(invoice.amount)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadInvoice(invoice.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 
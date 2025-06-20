import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { InvoiceService } from '@/lib/services/invoice-service'
import { format } from 'date-fns'

interface InvoiceDetailProps {
  invoiceId: string
}

interface Invoice {
  id: string
  booking_id: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  created_at: string
  items: Array<{
    description: string
    amount: number
    quantity: number
  }>
  customer: {
    name: string
    email: string
  }
  venue: {
    name: string
    address: string
  }
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  const loadInvoice = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/invoices/${invoiceId}`)
      if (!response.ok) {
        throw new Error('Failed to load invoice')
      }
      const data = await response.json()
      setInvoice(data)
    } catch (error) {
      console.error('Error loading invoice:', error)
      toast.error('Failed to load invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadInvoice = async () => {
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
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!invoice) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Invoice not found
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">Invoice #{invoice.id.slice(0, 8)}</h2>
          <p className="text-muted-foreground">
            Created on {format(new Date(invoice.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {getStatusBadge(invoice.status)}
          <Button onClick={handleDownloadInvoice}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <p>{invoice.customer.name}</p>
          <p className="text-muted-foreground">{invoice.customer.email}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Venue</h3>
          <p>{invoice.venue.name}</p>
          <p className="text-muted-foreground">{invoice.venue.address}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Items</h3>
        <div className="border rounded-lg">
          <div className="grid grid-cols-4 p-4 bg-muted/50 font-medium">
            <div>Description</div>
            <div className="text-right">Quantity</div>
            <div className="text-right">Unit Price</div>
            <div className="text-right">Amount</div>
          </div>
          {invoice.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 p-4 border-t"
            >
              <div>{item.description}</div>
              <div className="text-right">{item.quantity}</div>
              <div className="text-right">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency,
                }).format(item.amount / item.quantity)}
              </div>
              <div className="text-right">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency,
                }).format(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total</span>
            <span className="font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency,
              }).format(invoice.amount)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Due by {format(new Date(invoice.due_date), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    </Card>
  )
} 
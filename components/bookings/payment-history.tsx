import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { format } from 'date-fns'
import { Download, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { PaymentService } from '@/lib/services/payment-service'

interface PaymentHistoryProps {
  userId: string
}

export function PaymentHistory({ userId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPaymentHistory()
  }, [userId])

  const loadPaymentHistory = async () => {
    try {
      setIsLoading(true)
      const paymentService = PaymentService.getInstance()
      const history = await paymentService.getPaymentHistory(userId)
      setPayments(history)
    } catch (error) {
      console.error('Error loading payment history:', error)
      toast.error('Failed to load payment history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/receipt`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${paymentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
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

  if (payments.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No payment history found
        </div>
      </Card>
    )
  }

  return (
    <ScrollReveal>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">
                  {payment.bookings?.venue_name || 'Unknown Venue'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.created_at), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm">
                  {format(new Date(payment.bookings?.start_time), 'h:mm a')} -{' '}
                  {format(new Date(payment.bookings?.end_time), 'h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: payment.currency
                  }).format(payment.amount)}
                </p>
                <p className="text-sm capitalize text-muted-foreground">
                  {payment.status}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadReceipt(payment.id)}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ScrollReveal>
  )
} 
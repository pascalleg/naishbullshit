"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  MoreHorizontal,
  PiggyBank,
  Plus,
  Wallet,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { formatCurrency } from "@/lib/utils"

interface Balance {
  available: number
  pending: number
  total: number
}

interface Transaction {
  id: string
  type: 'payment' | 'withdrawal'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  created_at: string
  description: string
}

interface PaymentMethod {
  id: string
  type: 'bank_account' | 'paypal' | 'card'
  last4: string
  is_default: boolean
  brand?: string
  bank_name?: string
}

interface UpcomingPayment {
  id: string
  amount: number
  due_date: string
  description: string
  status: 'pending' | 'processing'
}

export default function PaymentsPage() {
  const { toast } = useToast()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false)
  const [balance, setBalance] = useState<Balance>({ available: 0, pending: 0, total: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([])
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [balanceRes, transactionsRes, methodsRes, upcomingRes] = await Promise.all([
        fetch('/api/payments/balance'),
        fetch('/api/payments/transactions'),
        fetch('/api/payments/methods'),
        fetch('/api/payments/upcoming'),
      ])

      if (!balanceRes.ok || !transactionsRes.ok || !methodsRes.ok || !upcomingRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [balanceData, transactionsData, methodsData, upcomingData] = await Promise.all([
        balanceRes.json(),
        transactionsRes.json(),
        methodsRes.json(),
        upcomingRes.json(),
      ])

      setBalance(balanceData)
      setTransactions(transactionsData)
      setPaymentMethods(methodsData)
      setUpcomingPayments(upcomingData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load payment data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawal = async () => {
    try {
      const amount = parseFloat(withdrawalAmount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: 'Invalid amount',
          description: 'Please enter a valid withdrawal amount',
          variant: 'destructive',
        })
        return
      }

      if (amount > balance.available) {
        toast({
          title: 'Insufficient funds',
          description: 'You do not have enough available balance',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error('Failed to process withdrawal')
      }

      toast({
        title: 'Success',
        description: 'Withdrawal request submitted successfully',
      })

      setWithdrawalAmount('')
      fetchData()
    } catch (error) {
      console.error('Error processing withdrawal:', error)
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal',
        variant: 'destructive',
      })
    }
  }

  const handleAddPaymentMethod = async () => {
    // Implement payment method addition logic
    toast({
      title: 'Coming soon',
      description: 'Payment method addition will be available soon',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 border-none">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-none">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500 border-none">Failed</Badge>
      default:
        return null
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowDownToLine className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpFromLine className="h-4 w-4 text-yellow-500" />
      default:
        return <DollarSign className="h-4 w-4 text-ethr-neonblue" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payments</h1>
        <NotificationBell />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(balance.available)}</p>
            <p className="text-sm text-muted-foreground">
              Pending: {formatCurrency(balance.pending)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(balance.total)}</p>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <Button
                onClick={handleWithdrawal}
                disabled={isLoading || !withdrawalAmount}
                className="w-full"
              >
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground">No transactions yet</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === 'payment'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'payment' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">{method.type}</p>
                      <p className="text-sm text-muted-foreground">
                        **** **** **** {method.last4}
                      </p>
                    </div>
                    {method.is_default && (
                      <span className="text-sm text-muted-foreground">Default</span>
                    )}
                  </div>
                ))}
                <Button onClick={handleAddPaymentMethod} className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {upcomingPayments.length === 0 ? (
                  <p className="text-center text-muted-foreground">No upcoming payments</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(payment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {payment.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdraw Funds Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="bg-ethr-darkgray">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Transfer your available balance to your bank account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center p-4 bg-ethr-black rounded-lg">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="text-xl font-bold">{formatCurrency(balance.available)}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  placeholder="0.00"
                  className="pl-10 bg-ethr-black border-muted"
                  defaultValue={balance.available.toString().replace("$", "")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Withdrawal Method</Label>
              <Select defaultValue="pm2">
                <SelectTrigger id="payment-method" className="bg-ethr-black border-muted">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods
                    .filter((method) => method.type === 'bank_account')
                    .map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.bank_name} •••• {method.last4}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Add a note for your records" className="bg-ethr-black border-muted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
              Withdraw Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={addPaymentMethodOpen} onOpenChange={setAddPaymentMethodOpen}>
        <DialogContent className="bg-ethr-darkgray">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new card or bank account for payments and withdrawals</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="bank">Bank Account</TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="John Smith" className="bg-ethr-black border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10 bg-ethr-black border-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="bg-ethr-black border-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="bg-ethr-black border-muted" />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="default-card"
                  className="h-4 w-4 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
                />
                <Label htmlFor="default-card" className="text-sm font-normal">
                  Set as default payment method
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Holder Name</Label>
                <Input id="account-name" placeholder="John Smith" className="bg-ethr-black border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input id="routing-number" placeholder="123456789" className="bg-ethr-black border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="1234567890" className="bg-ethr-black border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select defaultValue="checking">
                  <SelectTrigger id="account-type" className="bg-ethr-black border-muted">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="default-bank"
                  className="h-4 w-4 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
                />
                <Label htmlFor="default-bank" className="text-sm font-normal">
                  Set as default withdrawal method
                </Label>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPaymentMethodOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

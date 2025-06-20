"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar, FileText, Plus, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Contract {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled'
  payment_terms: {
    amount: number
    currency: string
    schedule: 'one_time' | 'weekly' | 'monthly'
    due_date?: string
  }
  parties: Array<{
    user_id: string
    role: 'client' | 'artist' | 'venue'
    signature?: string
    signed_at?: string
  }>
}

export default function ContractsPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchContracts()
  }, [activeTab])

  const fetchContracts = async () => {
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'all') {
        params.append('status', activeTab)
      }
      const response = await fetch('/api/contracts?' + params.toString())
      if (!response.ok) throw new Error('Failed to fetch contracts')
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      toast.error('Failed to load contracts')
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Contract['status']) => {
    const colors = {
      draft: 'bg-gray-500',
      pending: 'bg-yellow-500',
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-red-500'
    }
    return colors[status]
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const handleCreateContract = () => {
    router.push('/dashboard/contracts/new')
  }

  const handleViewContract = (id: string) => {
    router.push(`/dashboard/contracts/${id}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Button onClick={handleCreateContract}>
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : contracts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-32">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No contracts found</p>
                  </CardContent>
                </Card>
              ) : (
                contracts.map((contract) => (
                  <Card
                    key={contract.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleViewContract(contract.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{contract.title}</CardTitle>
                          <CardDescription>
                            {contract.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {format(new Date(contract.start_date), 'MMM d, yyyy')} -{' '}
                              {format(new Date(contract.end_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Payment</p>
                          <p className="text-sm mt-1">
                            {formatCurrency(contract.payment_terms.amount, contract.payment_terms.currency)}
                            {' '}
                            ({contract.payment_terms.schedule.replace('_', ' ')})
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {contract.parties.map((party) => (
                            <Badge
                              key={party.user_id}
                              variant="outline"
                              className="flex items-center"
                            >
                              {party.role.charAt(0).toUpperCase() + party.role.slice(1)}
                              {party.signed_at ? (
                                <Check className="ml-1 h-3 w-3 text-green-500" />
                              ) : (
                                <X className="ml-1 h-3 w-3 text-red-500" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

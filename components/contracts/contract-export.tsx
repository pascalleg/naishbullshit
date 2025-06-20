import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

interface ContractExportProps {
  contractId: string
  className?: string
}

export function ContractExport({ contractId, className }: ContractExportProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: 'pdf' | 'docx' | 'csv') => {
    try {
      setLoading(true)

      // Track export action
      await fetch(`/api/contracts/${contractId}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'export',
          details: { format }
        })
      })

      // Download file
      const response = await fetch(
        `/api/contracts/${contractId}/export?format=${format}`
      )

      if (!response.ok) {
        throw new Error('Failed to export contract')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contract-${contractId}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Contract exported successfully')
    } catch (error) {
      toast.error('Failed to export contract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={className}
          disabled={loading}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
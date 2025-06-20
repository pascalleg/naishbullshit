import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { APIError } from '@/lib/api-error'
import { format } from 'date-fns'
import PDFDocument from 'pdfkit'
import { Parser } from 'json2csv'
import { Document, Packer, Paragraph, TextRun } from 'docx'

const exportFormatSchema = z.enum(['pdf', 'docx', 'csv'])

type ExportFormat = z.infer<typeof exportFormatSchema>

export class ContractExportService {
  private static instance: ContractExportService

  private constructor() {}

  static getInstance(): ContractExportService {
    if (!ContractExportService.instance) {
      ContractExportService.instance = new ContractExportService()
    }
    return ContractExportService.instance
  }

  async exportContract(
    contractId: string,
    userId: string,
    format: ExportFormat
  ): Promise<{ data: Buffer; filename: string; contentType: string }> {
    // Get contract data
    const { data: contract, error } = await supabase
      .from('contracts')
      .select(`
        *,
        artist:artist_id (
          name,
          email
        ),
        venue:venue_id (
          name,
          email
        )
      `)
      .eq('id', contractId)
      .or(`created_by.eq.${userId},artist_id.eq.${userId},venue_id.eq.${userId}`)
      .single()

    if (error) {
      throw new APIError('Contract not found', 404)
    }

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

    // Generate export based on format
    switch (format) {
      case 'pdf':
        return this.generatePDF(contract)
      case 'docx':
        return this.generateDOCX(contract)
      case 'csv':
        return this.generateCSV(contract)
      default:
        throw new APIError('Unsupported export format', 400)
    }
  }

  private async generatePDF(contract: any): Promise<{
    data: Buffer
    filename: string
    contentType: string
  }> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument()
        const chunks: Buffer[] = []

        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
          const data = Buffer.concat(chunks)
          resolve({
            data,
            filename: `contract-${contract.id}.pdf`,
            contentType: 'application/pdf'
          })
        })

        // Add content to PDF
        doc.fontSize(20).text(contract.title, { align: 'center' })
        doc.moveDown()

        doc.fontSize(12).text('Contract Details', { underline: true })
        doc.moveDown()
        doc.text(`Status: ${contract.status}`)
        doc.text(
          `Start Date: ${format(new Date(contract.start_date), 'PPP')}`
        )
        doc.text(`End Date: ${format(new Date(contract.end_date), 'PPP')}`)
        doc.text(`Total Amount: $${contract.total_amount}`)
        doc.moveDown()

        doc.text('Parties', { underline: true })
        doc.moveDown()
        doc.text('Artist:')
        doc.text(`Name: ${contract.artist.name}`)
        doc.text(`Email: ${contract.artist.email}`)
        doc.text(`Signed: ${contract.artist_signed ? 'Yes' : 'No'}`)
        doc.moveDown()

        doc.text('Venue:')
        doc.text(`Name: ${contract.venue.name}`)
        doc.text(`Email: ${contract.venue.email}`)
        doc.text(`Signed: ${contract.venue_signed ? 'Yes' : 'No'}`)
        doc.moveDown()

        doc.text('Payment Schedule', { underline: true })
        doc.moveDown()
        contract.payment_schedule.forEach((payment: any) => {
          doc.text(
            `${format(new Date(payment.date), 'PPP')} - $${payment.amount}`
          )
        })

        if (contract.attachments && contract.attachments.length > 0) {
          doc.moveDown()
          doc.text('Attachments', { underline: true })
          doc.moveDown()
          contract.attachments.forEach((attachment: any) => {
            doc.text(attachment.name)
          })
        }

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private async generateDOCX(contract: any): Promise<{
    data: Buffer
    filename: string
    contentType: string
  }> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: contract.title,
                  bold: true,
                  size: 32
                })
              ],
              alignment: 'center'
            }),
            new Paragraph({
              children: [new TextRun('')]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Contract Details',
                  bold: true,
                  underline: true
                })
              ]
            }),
            new Paragraph({
              children: [new TextRun(`Status: ${contract.status}`)]
            }),
            new Paragraph({
              children: [
                new TextRun(
                  `Start Date: ${format(new Date(contract.start_date), 'PPP')}`
                )
              ]
            }),
            new Paragraph({
              children: [
                new TextRun(
                  `End Date: ${format(new Date(contract.end_date), 'PPP')}`
                )
              ]
            }),
            new Paragraph({
              children: [new TextRun(`Total Amount: $${contract.total_amount}`)]
            }),
            new Paragraph({
              children: [new TextRun('')]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Parties',
                  bold: true,
                  underline: true
                })
              ]
            }),
            new Paragraph({
              children: [new TextRun('Artist:')]
            }),
            new Paragraph({
              children: [new TextRun(`Name: ${contract.artist.name}`)]
            }),
            new Paragraph({
              children: [new TextRun(`Email: ${contract.artist.email}`)]
            }),
            new Paragraph({
              children: [
                new TextRun(`Signed: ${contract.artist_signed ? 'Yes' : 'No'}`)
              ]
            }),
            new Paragraph({
              children: [new TextRun('')]
            }),
            new Paragraph({
              children: [new TextRun('Venue:')]
            }),
            new Paragraph({
              children: [new TextRun(`Name: ${contract.venue.name}`)]
            }),
            new Paragraph({
              children: [new TextRun(`Email: ${contract.venue.email}`)]
            }),
            new Paragraph({
              children: [
                new TextRun(`Signed: ${contract.venue_signed ? 'Yes' : 'No'}`)
              ]
            }),
            new Paragraph({
              children: [new TextRun('')]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Payment Schedule',
                  bold: true,
                  underline: true
                })
              ]
            }),
            ...contract.payment_schedule.map((payment: any) =>
              new Paragraph({
                children: [
                  new TextRun(
                    `${format(new Date(payment.date), 'PPP')} - $${payment.amount}`
                  )
                ]
              })
            ),
            ...(contract.attachments && contract.attachments.length > 0
              ? [
                  new Paragraph({
                    children: [new TextRun('')]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Attachments',
                        bold: true,
                        underline: true
                      })
                    ]
                  }),
                  ...contract.attachments.map((attachment: any) =>
                    new Paragraph({
                      children: [new TextRun(attachment.name)]
                    })
                  )
                ]
              : [])
          ]
        }
      ]
    })

    const buffer = await Packer.toBuffer(doc)

    return {
      data: buffer,
      filename: `contract-${contract.id}.docx`,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  }

  private async generateCSV(contract: any): Promise<{
    data: Buffer
    filename: string
    contentType: string
  }> {
    const fields = [
      'id',
      'title',
      'status',
      'start_date',
      'end_date',
      'total_amount',
      'artist_name',
      'artist_email',
      'artist_signed',
      'venue_name',
      'venue_email',
      'venue_signed'
    ]

    const data = {
      id: contract.id,
      title: contract.title,
      status: contract.status,
      start_date: format(new Date(contract.start_date), 'PPP'),
      end_date: format(new Date(contract.end_date), 'PPP'),
      total_amount: contract.total_amount,
      artist_name: contract.artist.name,
      artist_email: contract.artist.email,
      artist_signed: contract.artist_signed ? 'Yes' : 'No',
      venue_name: contract.venue.name,
      venue_email: contract.venue.email,
      venue_signed: contract.venue_signed ? 'Yes' : 'No'
    }

    const parser = new Parser({ fields })
    const csv = parser.parse(data)

    return {
      data: Buffer.from(csv),
      filename: `contract-${contract.id}.csv`,
      contentType: 'text/csv'
    }
  }
}

export const contractExportService = ContractExportService.getInstance() 
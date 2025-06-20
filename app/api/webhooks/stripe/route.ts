import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PaymentService } from '@/lib/services/payment-service'
import { apiLogger } from '@/lib/api-logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      apiLogger.error('Webhook signature verification failed', { error: err })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const paymentService = PaymentService.getInstance()

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge)
        break
      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute)
        break
      default:
        apiLogger.info(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    apiLogger.error('Webhook error', { error })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { metadata } = paymentIntent
    if (!metadata.userId || !metadata.bookingId) {
      throw new Error('Missing required metadata')
    }

    await PaymentService.getInstance().updatePaymentStatus(
      metadata.bookingId,
      'completed',
      paymentIntent.id
    )
  } catch (error) {
    apiLogger.error('Failed to handle payment success', { error, paymentIntent })
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { metadata } = paymentIntent
    if (!metadata.userId || !metadata.bookingId) {
      throw new Error('Missing required metadata')
    }

    await PaymentService.getInstance().updatePaymentStatus(
      metadata.bookingId,
      'failed',
      paymentIntent.id
    )
  } catch (error) {
    apiLogger.error('Failed to handle payment failure', { error, paymentIntent })
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    const { metadata } = charge
    if (!metadata.userId || !metadata.bookingId) {
      throw new Error('Missing required metadata')
    }

    await PaymentService.getInstance().processRefund(
      metadata.bookingId,
      charge.amount_refunded,
      charge.id
    )
  } catch (error) {
    apiLogger.error('Failed to handle refund', { error, charge })
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  try {
    const { metadata } = dispute
    if (!metadata.userId || !metadata.bookingId) {
      throw new Error('Missing required metadata')
    }

    await PaymentService.getInstance().handleDispute(
      metadata.bookingId,
      dispute.id,
      dispute.status
    )
  } catch (error) {
    apiLogger.error('Failed to handle dispute', { error, dispute })
  }
} 
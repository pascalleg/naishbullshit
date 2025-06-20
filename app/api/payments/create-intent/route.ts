import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { apiAuth } from '@/lib/api-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: body.amount,
    currency: 'usd',
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
"use server";

import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import Stripe from "stripe";
import { stripe } from "@/lib/createStripeCheckoutSession";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("Missing orderId in session metadata:", session.id);
          return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
        }

        const order = await db.orderDetails.update({
          where: { id: orderId },
          data: {
            isPaid: true,
            status: "awaiting_shipment",
          },
        });

        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        console.log(`Order ${orderId} updated to paid and awaiting_shipment`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error processing webhook:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
"use server";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("Webhook event received:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error: Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout session completed:", session);

      const orderId = session.metadata?.orderId;
      if (!orderId) {
        console.error("No orderId in session metadata:", session);
        return NextResponse.json({ error: "Missing orderId in metadata" }, { status: 400 });
      }

      const order = await db.orderDetails.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        console.error("Order not found for orderId:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      await db.orderDetails.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          status: "awaiting_shipment",
        },
      });
      console.log(`Order ${orderId} marked as paid and status updated to awaiting_shipment`);
    }
  } catch (err) {
    console.error("Error processing webhook event:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
"use server";

import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import Stripe from "stripe";
import { stripe } from "@/lib/createStripeCheckoutSession";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await db.orderDetails.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title || "Untitled",
            images: item.thumbnail ? [item.thumbnail] : [],
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.qty,
      }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/summary?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { orderId },
      line_items: lineItems,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(
      "Stripe checkout session error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
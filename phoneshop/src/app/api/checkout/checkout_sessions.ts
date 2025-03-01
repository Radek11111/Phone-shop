"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    console.log("Received orderId:", orderId);

    if (!orderId) {
      console.log("Missing orderId");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    console.log("Fetching order from database...");
    const order = await db.orderDetails.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.log("Order not found for orderId:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log("Order found:", order);

    console.log("Creating line items...");
    const lineItems = order.items.map((item) => {
      console.log("Processing item:", item);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.thumbnail],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      };
    });
    console.log("Line items created:", lineItems);

    console.log("Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { orderId: order.id },
      line_items: lineItems,
    });
    console.log("Stripe session created:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
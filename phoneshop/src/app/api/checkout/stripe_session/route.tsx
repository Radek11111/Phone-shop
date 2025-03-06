"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    console.log("Received orderId:", orderId);

    if (!orderId) {
      console.log("No orderId provided");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    console.log("Querying database for order:", orderId);
    const order = await db.orderDetails.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.log("Order not found for orderId:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log("Order retrieved:", JSON.stringify(order, null, 2));

    console.log("Generating line items...");
    const lineItems = order.items.map((item) => {
      const lineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title || "Untitled", 
            images: item.thumbnail ? [item.thumbnail] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      };
      console.log("Generated line item:", lineItem);
      return lineItem;
    });

    console.log("Creating Stripe session with lineItems:", lineItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card","paypal"],
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
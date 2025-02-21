import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "@/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send("Webhook signature verification failed.");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId, total } = session.metadata || {};
    
    if (!orderId || !total) {
      return res.status(400).json({ error: "Missing orderId or total in metadata" });
    }

    try {
      await db.orderDetails.update({
        where: { id: orderId },
        data: { isPaid: true, total: parseFloat(total) },
      });
      console.log(`Order ${orderId} marked as paid with total ${total}.`);
    } catch (error) {
      console.error("Database update error:", error);
      return res.status(500).json({ error: "Failed to update order status" });
    }
  }

  res.json({ received: true });
}

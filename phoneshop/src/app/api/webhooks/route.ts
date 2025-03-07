"use server"
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let event;
    const signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return res.status(400).send("Webhook signature verification failed.");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const { orderId } = session.metadata || {};
      if (!orderId) {
        return res.status(400).json({ error: "Missing orderId in metadata" });
      }

      try {
        await db.orderDetails.update({
          where: { id: orderId },
          data: { isPaid: true },
        });
        console.log(`Order ${orderId} marked as paid.`);
      } catch (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ error: "Failed to update order status" });
      }
    }

   return res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

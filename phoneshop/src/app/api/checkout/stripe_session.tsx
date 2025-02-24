import { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "@/lib/stripe";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { items, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

import axios from "axios";
import Stripe from "stripe";

export const createCheckoutSession = async ({ orderId }: { orderId: string }) => {
  try {
    const response = await axios.post<{ sessionId: string }>(
      "/api/checkout/stripe_session",
      { orderId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Payment error:", error instanceof Error ? error.message : error);
    throw new Error("Failed to create checkout session");
  }
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2025-02-24.acacia',
  typescript: true
})
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error("Stripe public key is missing!");
}
const stripePromise = loadStripe(stripeKey);

export default function Payment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const carrier = searchParams.get("carrier");
  const paymentMethod = searchParams.get("paymentMethod");

  useEffect(() => {
    if (!orderId || !carrier || !paymentMethod) {
      setError("Missing required parameters.");
    }
  }, [orderId, carrier, paymentMethod]);

  const handlePayment = async () => {
    if (!orderId || !paymentMethod) {
      setError("Order ID or payment method is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/checkout/stripe_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethodTypes: [paymentMethod] }),
      });
      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error("Session ID not returned from server.");
      }
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      setError("Failed to process the payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Confirm your order and proceed to payment
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Carrier:</strong> {carrier}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <button
          onClick={handlePayment}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  console.log("Order ID from URL:", orderId);

  const handleCheckout = async () => {
    if (!orderId) {
      alert("Invalid order ID.");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending request to /api/checkout/stripe_session with orderId:", orderId);
      const response = await axios.post(
        "/api/checkout/stripe_session",
        { orderId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response from server:", response.data);

      const { sessionId } = response.data;
      if (!sessionId) {
        throw new Error("Session ID not returned from server");
      }
      console.log("Session ID received:", sessionId);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }
      console.log("Stripe initialized, redirecting to checkout...");

      await stripe.redirectToCheckout({ sessionId });
      console.log("Redirect initiated"); 
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return <p>Error: Order ID is missing.</p>;

  return (
    <div>
      <h1>Choose Payment Method</h1>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </div>
  );
};

export default PaymentPage;
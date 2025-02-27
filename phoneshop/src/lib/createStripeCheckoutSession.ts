import axios from "axios";

export const createCheckoutSession = async ({ orderId }: { orderId: string }) => {
  try {
    const response = await axios.post("/api/checkout/stripe_session", { orderId }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Payment error:", error);
    throw error;
  }
};

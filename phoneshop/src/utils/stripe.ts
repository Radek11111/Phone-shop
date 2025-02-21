import axios from "axios";

export const createStripeSession = async (orderId: string) => {
  try {
    const { data } = await axios.post("/api/checkout_sessions", { orderId });
    return data.sessionUrl;
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return null;
  }
};

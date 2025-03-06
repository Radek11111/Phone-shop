"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Image from "next/image";
import { CartItemRedux } from "@/store/cartSlice";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error("Stripe public key is missing!");
}
const stripePromise = loadStripe(stripeKey);


const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
});

type ShippingForm = z.infer<typeof shippingSchema>;

export default function ShippingForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const cart = useSelector((state: IRootState) => state.cart.cartItems);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit: SubmitHandler<ShippingForm> = async (data) => {
    if (!orderId) {
      setError("Order ID is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/shipping", { ...data, orderId });
      if (response.status !== 200) {
        throw new Error("Failed to save shipping details.");
      }
      const checkoutResponse = await axios.post(
        "/api/checkout/stripe_session",
        { orderId },
        { headers: { "Content-Type": "application/json" } }
      );
      const { sessionId } = checkoutResponse.data;
      if (!sessionId) {
        throw new Error("Session ID not returned from server.");
      }
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      setError("Failed to process the request. Please try again.");
      setLoading(false);
    }
  };

   const subtotal = cart.reduce(
      (accumulator: number, currentValue: CartItemRedux) =>
        accumulator + currentValue.price * currentValue.qty,
      0
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex gap-6">
      {/* Lewa strona: Produkty w koszyku */}
      <div className="">
        <div className="w-2/3 overflow-y-auto max-h-[400px] p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Your Cart</h2>
          <div className="space-y-4">
            {/* Placeholder dla produktów - zamień na dynamiczne */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-3 rounded-md shadow"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-md">
                  <Image
                    src={item.thumbnail}
                    width={100}
                    height={100}
                    alt={item.name}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Product {item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" bg-gray-200 rounded-lg">
          <p className="font-semibold">Total: ${subtotal.toFixed(2)}</p>
        </div>
      </div>
      {/* Prawa strona: Formularz + Podsumowanie */}
      <div className="w-1/3">
        <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Street Address"
            {...register("street")}
            className="input-field"
          />
          <input
            type="text"
            placeholder="City"
            {...register("city")}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Postal Code"
            {...register("postalCode")}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Country"
            {...register("country")}
            className="input-field"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
       
      </div>
    </div>
  );
}

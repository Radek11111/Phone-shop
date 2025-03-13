"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { CARRIERS, PAYMENT_METHODS } from "@/validatos/option-validator";

import { loadStripe } from "@stripe/stripe-js";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error("Stripe public key is missing!");
}
const stripePromise = loadStripe(stripeKey);

const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street address is required"),
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
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  console.log(orderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit: SubmitHandler<ShippingForm> = async (data) => {
    if (!orderId || !selectedCarrier) {
      setError(
        "Please select a carrier and payment method, and ensure orderId exists."
      );

      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/shipping", {
        ...data,
        orderId,
        carrier: selectedCarrier,
        paymentMethod: selectedPaymentMethod,
      });
      if (response.status !== 200) {
        throw new Error("Failed to save shipping details.");
      }
      if (!orderId) {
        setError("Order ID is missing!");
        return;
      }
      router.push(
        `/checkout/payment?orderId=${orderId}&carrier=${selectedCarrier}&paymentMethod=${selectedPaymentMethod}`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to process the request. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Shipping Details
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              {...register("name")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (optional)
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              {...register("phoneNumber")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              placeholder="Enter street address"
              {...register("street")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">
                {errors.street.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="Enter city"
              {...register("city")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province (optional)
            </label>
            <input
              type="text"
              placeholder="Enter state/province"
              {...register("state")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              placeholder="Enter postal code"
              {...register("postalCode")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postalCode.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              placeholder="Enter country"
              {...register("country")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Select Carrier
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CARRIERS.map((carrier) => (
              <div
                key={carrier.id}
                onClick={() => setSelectedCarrier(carrier.id)}
                className={`cursor-pointer p-4 border-2 rounded-md text-center transition-colors ${
                  selectedCarrier === carrier.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {carrier.name}
                </p>
              </div>
            ))}
          </div>
          {!selectedCarrier && (
            <p className="text-red-500 text-sm mt-2">
              Please select a carrier.
            </p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={loading || !selectedCarrier }
          >
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}


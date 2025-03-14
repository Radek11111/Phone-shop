"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { CARRIERS } from "@/validatos/option-validator";

const shippingSchema = z.object({
  name: z.string().min(1, "Imię i nazwisko są wymagane"),
  street: z.string().min(1, "Ulica jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
  country: z.string().min(1, "Kraj jest wymagany"),
  state: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function ShippingForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit: SubmitHandler<ShippingFormData> = async (data) => {
    if (!selectedCarrier) {
      setError("Proszę wybrać przewoźnika.");
      return;
    }

    try {
      setLoading(true);
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!cart || cart.length === 0) {
        throw new Error("Koszyk jest pusty");
      }

      const total = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.qty,
        0
      );

      const response = await axios.post("/api/orders", {
        items: cart,
        total,
        shipping: {
          ...data,
          carrier: selectedCarrier, 
        },
      });

      if (response.status !== 201) {
        throw new Error("Nie udało się zapisać danych zamówienia.");
      }

      const { orderId } = response.data;
      console.log("Utworzono zamówienie z ID:", orderId);
      router.push(
        `/checkout/payment?orderId=${orderId}&carrier=${selectedCarrier}`
      );
    } catch (err) {
      console.error("Błąd w ShippingForm:", err);
      setError("Nie udało się przetworzyć żądania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dane Wysyłkowe</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imię i nazwisko
          </label>
          <input
            {...register("name")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ulica
          </label>
          <input
            {...register("street")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Miasto
          </label>
          <input
            {...register("city")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kod pocztowy
          </label>
          <input
            {...register("postalCode")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kraj
          </label>
          <input
            {...register("country")}
            className="mt-1 block w-full p-2 border rounded"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stan/Województwo (opcjonalnie)
          </label>
          <input
            {...register("state")}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numer telefonu (opcjonalnie)
          </label>
          <input
            {...register("phoneNumber")}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Select Carrier
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CARRIERS.map((carrier) => (
              <div
                onClick={() => setSelectedCarrier(carrier.id)}
                className={`cursor-pointer p-4 border-2 rounded-md text-center transition-colors ${
                  selectedCarrier === carrier.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                key={carrier.id}
              >
                <p className="text-sm font-medium text-gray-800">
                  {carrier.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading || !selectedCarrier}
        >
          {loading ? "Przetwarzanie..." : "Dalej"}
        </button>
      </form>
    </div>
  );
}
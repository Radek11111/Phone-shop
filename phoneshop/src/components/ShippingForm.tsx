"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { CARRIERS } from "@/validatos/option-validator";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button
            variant="nostyle"
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-lg font-bold">Back</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Dane Wysyłkowe
            </h1>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ulica
                  </label>
                  <input
                    {...register("street")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miasto
                  </label>
                  <input
                    {...register("city")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kod pocztowy
                  </label>
                  <input
                    {...register("postalCode")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kraj
                  </label>
                  <input
                    {...register("country")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stan/Województwo (opcjonalnie)
                  </label>
                  <input
                    {...register("state")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numer telefonu (opcjonalnie)
                  </label>
                  <input
                    {...register("phoneNumber")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Wybierz przewoźnika
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {CARRIERS.map((carrier) => (
                    <div
                      onClick={() => setSelectedCarrier(carrier.id)}
                      className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                        selectedCarrier === carrier.id
                          ? "border-slate-500 bg-slate-100 shadow-md"
                          : "border-gray-200 hover:border-zinc-400 hover:shadow-sm"
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

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                    loading || !selectedCarrier
                      ? "bg-zinc-400 cursor-not-allowed"
                      : "bg-zinc-600 hover:bg-zinc-700 shadow-md hover:shadow-lg"
                  }`}
                  disabled={loading || !selectedCarrier}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Przetwarzanie...
                    </span>
                  ) : (
                    "Dalej"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

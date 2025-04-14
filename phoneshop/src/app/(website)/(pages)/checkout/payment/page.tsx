"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { SubmitHandler } from "react-hook-form";
import { ShippingData, OrderData } from "@/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import "react-medium-image-zoom/dist/styles.css";
import ShippingFormFields from "@/components/ShippingFormFields";
import { ShippingFormData } from "@/validatos/shippingSchema";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error("Stripe public key is missing!");
}
const stripePromise = loadStripe(stripeKey);

export default function OrderSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const carrier = searchParams.get("carrier");

  useEffect(() => {
    if (!orderId || !carrier) {
      setError("Brak wymaganych parametrów.");
      return;
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/order/${orderId}`);

        if (!response.data) {
          throw new Error("Serwer nie zwrócił danych");
        }

        setOrderData(response.data);
        setShippingData(response.data.shipping);
        setError(null);
      } catch (err) {
        console.error("Błąd przy pobieraniu szczegółów zamówienia:", err);
        setError(
          "Nie udało się załadować szczegółów zamówienia. Spróbuj ponownie później."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, carrier]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout/stripe_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Error creating payment session");
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error("Server did not return session ID.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe initialization failed.");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  const saveEditedData: SubmitHandler<ShippingFormData> = async (data) => {
    try {
      setLoading(true);
      await axios.put(`/api/payment/${orderId}`, data);
      setShippingData(data);
      setIsEditing(false);
    } catch (err) {
      setError("Nie udało się zapisać zmian. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Podsumowanie Zamówienia
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading && !orderData ? (
          <p>Ładowanie szczegółów zamówienia...</p>
        ) : orderData ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Produkty</h2>
              <div className="overflow-auto max-h-60 border p-4 rounded-md">
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map(({ id, name, qty, price, thumbnail }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          alt="product"
                          width={50}
                          height={50}
                          src={thumbnail}
                          className="rounded-md object-cover transform transition-transform duration-300 scale-75 data-[zoomed=true]:scale-100"
                        />

                        <p>
                          {name} x {qty}
                        </p>
                      </div>
                      <p>{(price * qty).toFixed(2)} USD</p>
                    </div>
                  ))
                ) : (
                  <p>Brak produktów w zamówieniu.</p>
                )}
              </div>
              <p className="text-xl font-semibold mt-4">
                Łącznie: {orderData.total.toFixed(2)} USD
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Dane Wysyłkowe</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-slate-500 hover:underline"
                >
                  {isEditing ? "Anuluj" : "Edytuj"}
                </button>
              </div>

              {isEditing && shippingData ? (
                <ShippingFormFields
                  defaultValues={shippingData}
                  onSubmit={saveEditedData}
                  submitButtonText="Zapisz"
                  isLoading={loading}
                />
              ) : shippingData ? (
                <div className="border p-4 rounded-md">
                  <p>{shippingData.name}</p>
                  <p>{shippingData.street}</p>
                  <p>
                    {shippingData.city}, {shippingData.postalCode}
                  </p>
                  <p>{shippingData.country}</p>
                  {shippingData.state && (
                    <p>Stan/Województwo: {shippingData.state}</p>
                  )}
                  {shippingData.phoneNumber && (
                    <p>Telefon: {shippingData.phoneNumber}</p>
                  )}
                  <p>Przewoźnik: {carrier}</p>
                </div>
              ) : (
                <p>Brak danych wysyłkowych.</p>
              )}
            </div>

            <button
              onClick={handlePayment}
              className="w-full px-6 py-2 bg-zinc-500 text-white rounded-md hover:bg-zinc-600 transition-colors"
              disabled={loading || isEditing || orderData.isPaid}
            >
              {loading
                ? "Przetwarzanie..."
                : orderData.isPaid
                ? "Opłacone"
                : "Zapłać"}
            </button>
          </div>
        ) : (
          <p>Brak danych zamówienia.</p>
        )}
      </div>
    </>
  );
}

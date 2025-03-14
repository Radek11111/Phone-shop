"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail?: string;
}

interface ShippingData {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string | null;
  phoneNumber?: string | null;
}

interface OrderData {
  id: string;
  items: CartItem[];
  total: number;
  shipping: ShippingData | null;
  status: "awaiting_payment" | "awaiting_shipment" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  isPaid: boolean;
}

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
  const sessionId = searchParams.get("session_id");
  const carrier = searchParams.get("carrier");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("orderId:", orderId);
    console.log("sessionId:", sessionId);
    console.log("carrier:", carrier);

    if (!orderId || !carrier) {
      setError("Brak wymaganych parametrów.");
      return;
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);

        // Weryfikacja płatności i aktualizacja zamówienia
        const success = searchParams.get("success");
        if (success === "true" && sessionId) {
          const verifyResponse = await axios.get(`/api/stripe/verify-payment?orderId=${orderId}&session_id=${sessionId}`);
          if (!verifyResponse.data.success) {
            throw new Error("Payment verification failed");
          }
          console.log("Payment verified and order updated:", verifyResponse.data);

          // Czyścimy koszyk po udanej weryfikacji
          dispatch(clearCart());
          localStorage.removeItem("cart");
          console.log("Koszyk wyczyszczony po udanej płatności");
          router.push("/checkout/summary");
        }

        // Pobierz zaktualizowane dane zamówienia
        const response = await axios.get<OrderData>(`/api/order/${orderId}`, {
          timeout: 5000,
        });

        if (!response.data) {
          throw new Error("Serwer nie zwrócił danych");
        }

        console.log("Pobrane dane zamówienia:", response.data);
        setOrderData(response.data);
        setShippingData(response.data.shipping);
        setError(null);
      } catch (err) {
        console.error("Błąd przy pobieraniu szczegółów zamówienia:", err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Zamówienie nie zostało znalezione.");
        } else {
          setError("Nie udało się załadować szczegółów zamówienia. Spróbuj ponownie później.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, sessionId, carrier, searchParams, dispatch, router]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout/stripe_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Błąd przy tworzeniu sesji płatności");
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error("Serwer nie zwrócił ID sesji.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Inicjalizacja Stripe nie powiodła się.");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Błąd płatności:", err);
      setError("Nie udało się przetworzyć płatności. Spróbuj ponownie.");
      setLoading(false);
    }
  };

  const saveEditedData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData) return;

    try {
      setLoading(true);
      await axios.put(`/api/shipping/${orderId}`, {
        shipping: shippingData,
      });
      setIsEditing(false);
      const response = await axios.get<OrderData>(`/api/order/${orderId}`);
      setOrderData(response.data);
      setShippingData(response.data.shipping);
      setError(null);
    } catch (err) {
      console.error("Błąd przy zapisywaniu danych:", err);
      setError("Nie udało się zapisać zmian. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Podsumowanie Zamówienia</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && !orderData ? (
        <p>Ładowanie szczegółów zamówienia...</p>
      ) : orderData ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Produkty</h2>
            <div className="overflow-auto max-h-60 border p-4 rounded-md">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map(({ id, name, qty, price }) => (
                  <div key={id} className="flex justify-between border-b py-2">
                    <p>{name} x {qty}</p>
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
                className="text-blue-500 hover:underline"
              >
                {isEditing ? "Anuluj" : "Edytuj"}
              </button>
            </div>

            {isEditing && shippingData ? (
              <form onSubmit={saveEditedData} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
                  <input
                    type="text"
                    value={shippingData.name || ""}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ulica</label>
                  <input
                    type="text"
                    value={shippingData.street || ""}
                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Miasto</label>
                  <input
                    type="text"
                    value={shippingData.city || ""}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod pocztowy</label>
                  <input
                    type="text"
                    value={shippingData.postalCode || ""}
                    onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kraj</label>
                  <input
                    type="text"
                    value={shippingData.country || ""}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stan/Województwo (opcjonalnie)</label>
                  <input
                    type="text"
                    value={shippingData.state || ""}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numer telefonu (opcjonalnie)</label>
                  <input
                    type="text"
                    value={shippingData.phoneNumber || ""}
                    onChange={(e) => setShippingData({ ...shippingData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Zapisywanie..." : "Zapisz"}
                </button>
              </form>
            ) : shippingData ? (
              <div className="border p-4 rounded-md">
                <p>{shippingData.name}</p>
                <p>{shippingData.street}</p>
                <p>{shippingData.city}, {shippingData.postalCode}</p>
                <p>{shippingData.country}</p>
                {shippingData.state && <p>Stan/Województwo: {shippingData.state}</p>}
                {shippingData.phoneNumber && <p>Telefon: {shippingData.phoneNumber}</p>}
                <p>Przewoźnik: {carrier}</p>
              </div>
            ) : (
              <p>Brak danych wysyłkowych.</p>
            )}
          </div>

          <button
            onClick={handlePayment}
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={loading || isEditing || orderData.isPaid}
          >
            {loading ? "Przetwarzanie..." : orderData.isPaid ? "Opłacone" : "Zapłać"}
          </button>
        </div>
      ) : (
        <p>Brak danych zamówienia.</p>
      )}
    </div>
  );
}
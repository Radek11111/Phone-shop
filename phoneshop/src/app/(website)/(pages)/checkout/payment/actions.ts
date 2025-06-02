"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { OrderData, ShippingData } from "@/types";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

export function usePayment() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const carrier = searchParams.get("carrier");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("searchParams:", { orderId, carrier });
    if (!orderId) {
      setError("Brak wymaganych parametrów.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Pobieranie danych zamówienia dla ID:", orderId);
        const response = await axios.get(`/api/order/${orderId}`);

        if (!response.data || !response.data.id) {
          throw new Error("Nieprawidłowe dane zamówienia");
        }

        const order = {
          ...response.data,
          isPaid: response.data.isPaid ?? false,
          items: response.data.items || [],
        };

        setOrderData(order);
        setShippingData(response.data.shipping || null);

        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        if (success === "true" && sessionId) {
          try {
            const sessionResponse = await axios.get(
              `/api/stripe/session/${sessionId}`
            );
            console.log("Odpowiedź sesji Stripe:", sessionResponse.data);
            const session = sessionResponse.data;
            if (
              session.payment_status === "paid" &&
              session.metadata.orderId === orderId
            ) {
              await axios.put(`/api/payment/${orderId}`, { isPaid: true });
              setOrderData((prev) => (prev ? { ...prev, isPaid: true } : prev));
              dispatch(clearCart());
            }
          } catch (err) {
            console.error("Błąd sesji Stripe:", err);
            setError("Nie udało się zweryfikować płatności.");
          }
        }

        if (!order.isPaid && success === "true") {
          console.log("isPaid jest false, ponawianie za 2 sekundy...");
          setTimeout(async () => {
            const retryResponse = await axios.get(`/api/order/${orderId}`);
            console.log("Ponowna odpowiedź API:", retryResponse.data);
            const retryOrder = {
              ...retryResponse.data,
              isPaid: retryResponse.data.isPaid ?? false,
            };
            setOrderData(retryOrder);
            setShippingData(retryResponse.data.shipping || null);
            if (retryOrder.isPaid) {
              dispatch(clearCart());
              console.log("Koszyk wyczyszczony po pomyślnym zamówieniu.");
            }
          }, 2000);
        }
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
        setError("Nie udało się załadować danych zamówienia.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, carrier, searchParams, dispatch]);

  return {
    orderData,
    shippingData,
    setShippingData,
    loading,
    error,
    orderId,
    carrier,
  };
}

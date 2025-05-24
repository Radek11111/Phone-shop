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
    if (!orderId || !carrier) {
      setError("Brak wymaganych parametrów.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching order with ID:", orderId);
        const response = await axios.get(`/api/order/${orderId}`);
        console.log("API response:", response.data);

        if (!response.data || !response.data.id) {
          throw new Error("Nieprawidłowe dane zamówienia");
        }
        setOrderData(response.data);
        setShippingData(response.data.shipping || null);

        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        if (success === "true" && sessionId && response.data.isPaid) {
          const sessionResponse = await axios.get(
            `/api/stripe/session/${sessionId}`
          );
          console.log("Session response:", sessionResponse.data);
          const session = sessionResponse.data;
          if (
            session.payment_status === "paid" &&
            session.metadata.orderId === orderId
          ) {
            dispatch(clearCart());
            console.log("Koszyk wyczyszczony po pomyślnym zamówieniu.");
          }
        }

        if (!response.data.isPaid && success === "true") {
          console.log("isPaid is false, retrying in 2 seconds...");
          setTimeout(async () => {
            const retryResponse = await axios.get(`/api/order/${orderId}`);
            console.log("Retry API response:", retryResponse.data);
            setOrderData(retryResponse.data);
            setShippingData(retryResponse.data.shipping);
            if (retryResponse.data.isPaid) {
              dispatch(clearCart());
              console.log("Koszyk wyczyszczony po pomyślnym zamówieniu.");
            }
          }, 2000);
        }
      } catch (err) {
        console.error("Fetch error:", err);
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

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetOrder } from "@/store/orderSlice";
import { clearCart } from "@/store/cartSlice";
import { OrderData, ShippingData } from "@/types";

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
        const response = await axios.get(`/api/order/${orderId}`);
        setOrderData(response.data);
        setShippingData(response.data.shipping);

        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        console.log("Success:", success, "Session ID:", sessionId);

        if (success === "true" && sessionId) {
          const sessionResponse = await axios.get(
            `/api/stripe/session/${sessionId}`
          );
          const session = sessionResponse.data;
          console.log("Session data:", {
            payment_status: session.payment_status,
            metadata_orderId: session.metadata?.orderId,
            url_orderId: orderId,
          });

          if (
            session.payment_status === "paid" &&
            session.metadata?.orderId === orderId
          ) {
            dispatch(clearCart());
            dispatch(resetOrder());
            console.log(
              "Koszyk i zamówienie wyczyszczone po pomyślnym zamówieniu (pierwsza próba)."
            );
          } else {
            console.log("Warunek resetu nie spełniony:", {
              isPaid: session.payment_status === "paid",
              orderIdMatch: session.metadata?.orderId === orderId,
            });
          }
        }

        if (!response.data.isPaid && success === "true") {
          console.log("isPaid is false, retrying in 5 seconds...");
          setTimeout(async () => {
            try {
              const retryResponse = await axios.get(`/api/order/${orderId}`);
              setOrderData(retryResponse.data);
              setShippingData(retryResponse.data.shipping);
              console.log("Retry isPaid:", retryResponse.data.isPaid);
              if (retryResponse.data.isPaid) {
                dispatch(clearCart());
                dispatch(resetOrder());
                console.log(
                  "Koszyk i zamówienie wyczyszczone po pomyślnym zamówieniu (ponowna próba)."
                );
              }
            } catch (err) {
              console.error("Retry fetch error:", err);
            }
          }, 5000);
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
    loading,
    error,
    orderId,
    carrier,
  };
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { OrderData, ShippingData } from "@/types";
import { useDispatch } from "react-redux";
import { resetOrder } from "@/store/orderSlice";

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
        if (success === "true" && sessionId) {
          const sessionResponse = await axios.get(
            `/api/stripe/session/${sessionId}`);
            const session = sessionResponse.data;
            if(
              session.payment_status === "paid" && session.metadata.orderId === orderId) {
                dispatch(resetOrder());
                console.log("Koszyk wyczyszczony po pomyślnym zamówieniu.");
              }
            
        }

        if(!response.data.isPaid && success === "true") {
          console.log("isPaid is false, retrying in 2 seconds...");
          setTimeout(async()=> {
            const retryResponse = await axios.get(`/api/order/${orderId}`);
            setOrderData(retryResponse.data);
            setShippingData(retryResponse.data.shipping);
            if(retryResponse.data.isPaid) {
              dispatch(resetOrder());
              console.log("Koszyk wyczyszczony po pomyślnym zamówieniu.");
            }
          } , 2000);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nie udało się załadować danych zamówienia.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, carrier]);

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

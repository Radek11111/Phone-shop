"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { OrderData, ShippingData } from "@/types";

export function usePayment() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const carrier = searchParams.get("carrier");

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

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import axios from "axios";
import ShippingForm from "@/components/ShippingForm";
import { ShippingFormData } from "@/validatos/shippingSchema";

export default function Shipping() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const router = useRouter();

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

      const response = await axios.post("/api/order", {
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
      router.push(
        `/checkout/payment?orderId=${orderId}&carrier=${selectedCarrier}`
      );
    } catch (err) {
      console.error("Błąd w Shipping:", err);
      setError("Nie udało się przetworzyć żądania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShippingForm
      onSubmit={onSubmit}
      error={error}
      isLoading={loading}
      selectedCarrier={selectedCarrier}
      setSelectedCarrier={setSelectedCarrier}
    />
  );
}

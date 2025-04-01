"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

export default function PaymentSummary() {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [data, setData] = useState<any>(undefined); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      let retryCount = 0;
      const maxRetries = 3;

      const attemptFetch = async () => {
        try {
          const response = await axios.get(`/api/order/${orderId}`, {
            params: { orderId },
          });
          setData(response.data);
          setLoading(false);

          if (response.data && response.data.success) {
            setShowConfetti(true);
          }
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => attemptFetch(), 500);
          } else {
            console.error("Failed to fetch payment status:", error);
            setLoading(false);
          }
        }
      };

      attemptFetch();
    };

    if (orderId) {
      fetchPaymentStatus();
    }
  }, [orderId]);

  if (loading || data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  const { success, price, shippingAddress } = data;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 450, spread: 100 }}
        />
      </div>
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            {success ? "Płatność zakończona sukcesem!" : "Płatność nieudana"}
          </h1>
          <p className="text-lg">
            Numer zamówienia: <span className="font-semibold">{orderId}</span>
          </p>
          {success ? (
            <>
              <p className="text-green-600">Kwota: {price.toFixed(2)} USD</p>
              <p>
                Dziękujemy za zakup! Szczegóły zamówienia zostały wysłane na
                Twój adres e-mail.
              </p>
            </>
          ) : (
            <p className="text-red-600">
              Wystąpił problem z przetworzeniem płatności. Spróbuj ponownie lub
              skontaktuj się z obsługą.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePayment } from "@/app/(website)/(pages)/checkout/payment/actions"; 
import { Button } from "@/components/ui/button"; 
import { ArrowLeft } from "lucide-react";
import Confetti from "react-confetti"; 


export default function Page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orderData, shippingData, loading, error } = usePayment();

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true));

  useEffect(() => {
    if (orderData?.isPaid && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); 
      return () => clearTimeout(timer);
    }
  }, [orderData?.isPaid, showConfetti]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error || "Brak danych zamówienia."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
        >
          <Confetti
            run={showConfetti} 
            numberOfPieces={200} 
            width={window.innerWidth} 
            height={window.innerHeight}
          />
        </div>

        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Potwierdzenie</h1>
          <p className="text-gray-600">
            Numer zamówienia: {orderId || "Brak numeru"}
          </p>
          <p className="text-gray-500 text-sm">
            Data złożenia zamówienia: {new Date().toLocaleDateString("pl-PL")}
          </p>
        </div>

        {/* Adres dostawy */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Adres dostawy
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>{shippingData?.name || "Brak danych"}</p>
            <p>{shippingData?.street || "Brak danych"}</p>
            <p>
              {shippingData?.city || "Brak danych"},{" "}
              {shippingData?.postalCode || "Brak danych"}
            </p>
            <p>{shippingData?.country || "Brak danych"}</p>
            {shippingData?.state && <p>{shippingData.state}</p>}
            {shippingData?.phoneNumber && <p>{shippingData.phoneNumber}</p>}
          </div>
        </div>

        {/* Dane do faktury */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Dane do faktury
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>Jan Kowalski</p>
            <p>ul. Przykładowa 10</p>
            <p>Warszawa, 00-001</p>
            <p>Polska</p>
            <p>NIP: 123-456-78-90</p>
          </div>
        </div>

        {/* Zamawiane produkty */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Zamawiane produkty
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {orderData.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* Placeholder dla obrazu, zamień na Image */}
                    <span className="text-gray-500">Miniaturka</span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      {item.title || "Produkt"}
                    </p>
                    <p className="text-gray-500 text-sm">x {item.qty}</p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">
                  {(item.price * item.qty).toFixed(2)} PLN
                </p>
              </div>
            ))}
            <p className="mt-4 text-lg font-semibold text-gray-900">
              Razem:{" "}
              <span className="text-blue-600">
                {orderData.total.toFixed(2)} PLN
              </span>
            </p>
          </div>
        </div>

        {/* Metoda płatności i transportu */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Szczegóły płatności i transportu
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>Metoda płatności: Płatność za pobraniem</p>
            <p>Metoda transportu: Kurier DPD</p>
          </div>
        </div>

        {/* Przycisk Wróć do sklepu */}
        <Button
          variant="default"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Wróć do sklepu
        </Button>
      </div>
    </div>
  );
}

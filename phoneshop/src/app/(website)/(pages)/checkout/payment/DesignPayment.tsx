"use client";

import { useRouter } from "next/navigation";
import { ShippingFormData } from "@/validatos/shippingSchema";
import { SubmitHandler } from "react-hook-form";
import ShippingFormFields from "@/components/ShippingFormFields";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { usePayment } from "./actions";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentSummary() {
  const {
    orderData,
    shippingData,
    setShippingData,
    loading,
    error,
    orderId,
    carrier,
  } = usePayment();
  const [isEditing, setIsEditing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLocalLoading(true);
      const res = await fetch("/api/checkout/stripe_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      setFormError("Nie udało się przetworzyć płatności.");
    } finally {
      setLocalLoading(false);
    }
  };

  const saveEditedData: SubmitHandler<ShippingFormData> = async (data) => {
    try {
      setLocalLoading(true);
      await fetch(`/api/payment/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setShippingData(data);
      setIsEditing(false);
    } catch (err) {
      setFormError("Nie udało się zapisać danych.");
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Button onClick={() => router.back()} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2" />
        Wróć
      </Button>

      <h1 className="text-3xl font-bold mb-4">Podsumowanie Zamówienia</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Produkty</h2>
        <div className="border rounded-md p-4">
          {orderData?.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Image
                  src={item.thumbnail}
                  width={50}
                  height={50}
                  alt="thumb"
                />
                <span>
                  {item.name} x {item.qty}
                </span>
              </div>
              <span>{(item.price * item.qty).toFixed(2)} USD</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-lg font-semibold">
          Łącznie: {orderData?.total.toFixed(2)} USD
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dane Wysyłkowe</h2>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-blue-600 underline"
          >
            {isEditing ? "Anuluj" : "Edytuj"}
          </button>
        </div>

        {isEditing && shippingData ? (
          <ShippingFormFields
            defaultValues={shippingData}
            onSubmit={saveEditedData}
            submitButtonText="Zapisz"
            isLoading={localLoading}
          />
        ) : (
          <div className="border rounded-md p-4 mt-2">
            <p>{shippingData?.name}</p>
            <p>{shippingData?.street}</p>
            <p>
              {shippingData?.city}, {shippingData?.postalCode}
            </p>
            <p>{shippingData?.country}</p>
            {shippingData?.state && <p>{shippingData.state}</p>}
            {shippingData?.phoneNumber && <p>{shippingData.phoneNumber}</p>}
            <p>Przewoźnik: {carrier}</p>
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
        disabled={localLoading || isEditing || orderData?.isPaid}
      >
        {localLoading
          ? "Przetwarzanie..."
          : orderData?.isPaid
          ? "Opłacone"
          : "Zapłać"}
      </button>

      {formError && <p className="text-red-500 mt-4">{formError}</p>}
    </div>
  );
}

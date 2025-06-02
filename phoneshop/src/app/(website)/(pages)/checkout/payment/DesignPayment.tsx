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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Summary</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          {orderData?.items && orderData.items.length > 0 ? (
            orderData.items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.thumbnail}
                    width={60}
                    height={60}
                    alt={item.name}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-gray-800 font-medium">
                      {item.name}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      x {item.qty}
                    </span>
                  </div>
                </div>
                <span className="text-gray-800 font-medium">
                  {(item.price * item.qty).toFixed(2)} USD
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Brak produktów</p>
          )}
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-900 justify-end items-end flex">
          Total:{" "}
          <span className="text-slate-600">
            {orderData?.total.toFixed(2) || "0.00"} USD
          </span>
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Shipping Details
          </h2>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditing && shippingData ? (
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <ShippingFormFields
              defaultValues={shippingData}
              onSubmit={saveEditedData}
              submitButtonText="Save"
              isLoading={localLoading}
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium">Name:</span> {shippingData?.name}
              </p>
              <p>
                <span className="font-medium">Street:</span>{" "}
                {shippingData?.street}
              </p>
              <p>
                <span className="font-medium">City:</span> {shippingData?.city},{" "}
                {shippingData?.postalCode}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {shippingData?.country}
              </p>
              {shippingData?.state && (
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {shippingData?.state}
                </p>
              )}
              {shippingData?.phoneNumber && (
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {shippingData?.phoneNumber}
                </p>
              )}
              <p>
                <span className="font-medium">Carrier:</span> {carrier}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        disabled={localLoading || isEditing || orderData?.isPaid}
      >
        {localLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : orderData?.isPaid ? (
          "Paid"
        ) : (
          "Pay Now"
        )}
      </button>

      {formError && (
        <p className="mt-4 text-red-500 text-center font-medium bg-red-50 p-3 rounded-lg">
          {formError}
        </p>
      )}
    </div>
  );
}

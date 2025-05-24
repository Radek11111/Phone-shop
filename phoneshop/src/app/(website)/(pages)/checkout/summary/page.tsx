"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Confetti from "react-confetti";
import { usePayment } from "@/app/(website)/(pages)/checkout/payment/actions";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orderData, shippingData, loading, error, carrier } = usePayment();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (orderData?.isPaid && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderData?.isPaid, showConfetti]);

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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Confirmation</h1>
          <p className="text-gray-600">
            Order number: {orderId || "No order number"}
          </p>
          <p className="text-gray-500 text-sm">
            Date order: {new Date().toLocaleDateString("pl-PL")}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Delivery address
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>{shippingData?.name || "No data available"}</p>
            <p>{shippingData?.street || "No data available"}</p>
            <p>
              {shippingData?.city || "No data available"},{" "}
              {shippingData?.postalCode || "No data available"}
            </p>
            <p>{shippingData?.country || "No data available"}</p>
            {shippingData?.state && <p>{shippingData.state}</p>}
            {shippingData?.phoneNumber && <p>{shippingData.phoneNumber}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Invoice details
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>{shippingData?.name || "No data available"}</p>
            <p>{shippingData?.street || "No data available"}</p>
            <p>
              {shippingData?.city || "No data available"},{" "}
              {shippingData?.postalCode || "No data available"}
            </p>
            <p>{shippingData?.country || "No data available"}</p>
            {shippingData?.state && <p>{shippingData.state}</p>}
            {shippingData?.phoneNumber && <p>{shippingData.phoneNumber}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Products ordered
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {orderData?.items.map((item) => (
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
                    <p className="text-gray-800 font-medium">
                      {item.title || "Product"}
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
              Total:{" "}
              <span className="text-blue-600">
                {orderData?.total.toFixed(2)} PLN
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment and shipping details
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>Payment method: Cash on delivery</p>
            <p>
              Shipping method: {carrier || "No carrier available"}
            </p>
          </div>
        </div>

        <Button
          variant="default"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to shop
        </Button>
      </div>
    </div>
  );
}

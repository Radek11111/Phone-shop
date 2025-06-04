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
  }, [orderData, showConfetti]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:pr-3 xl:pr-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Thank you for your order
            </h1>
            <p className="text-gray-600 mt-2">
              Order number: {orderId || "No order number"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Order date: {new Date().toLocaleDateString("pl-PL")}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Delivery address
              </h2>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 text-sm sm:text-base">
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

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Invoice details
              </h2>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 text-sm sm:text-base">
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

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                Payment and shipping
              </h2>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 text-sm sm:text-base">
                <p>Payment method: Card</p>
                <p>Shipping method: {carrier || "No carrier available"}</p>
                <p>Payment status: {orderData?.isPaid ? "Paid" : "Not paid"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:pl-3 xl:pl-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Ordered products
            </h2>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
              {orderData?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start sm:items-center py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="min-w-[50px] sm:min-w-[60px]">
                      <Image
                        src={item.thumbnail}
                        width={60}
                        height={60}
                        alt={item.name || "Product image"}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {item.title || "Product"}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Quantity: {item.qty}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-medium text-sm sm:text-base whitespace-nowrap pl-2">
                    {(item.price * item.qty).toFixed(2)} USD
                  </p>
                </div>
              ))}
              <p className="mt-4 text-base sm:text-lg font-semibold text-gray-900 flex justify-end items-center">
                Total:{" "}
                <span className="text-slate-600 ml-2">
                  {orderData?.total.toFixed(2)} USD
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
        >
          <Confetti
            run={showConfetti}
            numberOfPieces={200}
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
          />
        </div>
      </div>

      <div className="mt-6 max-w-5xl mx-auto">
        <Button
          variant="default"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Back to shop
        </Button>
      </div>
    </div>
  );
}

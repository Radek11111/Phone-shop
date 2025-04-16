"use client"
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentSummary = dynamic(() => import("./DesignPayment"), { ssr: false });

export default function SummaryPage() {
  return (
    <Suspense fallback={<p>Ładowanie strony zamówienia...</p>}>
      <PaymentSummary />
    </Suspense>
  );
}

"use client"
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentSummary = dynamic(() => import("./DesignPayment"), { ssr: false });

export default function SummaryPage() {
  return (
    <Suspense fallback={<p>Loading the order page...</p>}>
      <PaymentSummary />
    </Suspense>
  );
}

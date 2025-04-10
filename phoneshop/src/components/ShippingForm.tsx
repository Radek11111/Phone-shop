"use client";

import { SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import ShippingFormFields from "@/components/ShippingFormFields";
import { ShippingFormData } from "@/validatos/shippingSchema";
import { CARRIERS } from "@/validatos/option-validator";

interface ShippingFormProps {
  onSubmit: SubmitHandler<ShippingFormData>;
  error: string | null;
  isLoading: boolean;
  selectedCarrier: string | null;
  setSelectedCarrier: (carrier: string | null) => void;
}

export default function ShippingForm({
  onSubmit,
  error,
  isLoading,
  selectedCarrier,
  setSelectedCarrier,
}: ShippingFormProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button
            variant="nostyle"
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-lg font-bold">Back</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Dane Wysyłkowe
            </h1>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <ShippingFormFields
              onSubmit={onSubmit}
              submitButtonText="Dalej"
              isLoading={isLoading}
            />

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Wybierz przewoźnika
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {CARRIERS.map((carrier) => (
                  <div
                    onClick={() => setSelectedCarrier(carrier.id)}
                    className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                      selectedCarrier === carrier.id
                        ? "border-slate-500 bg-slate-100 shadow-md"
                        : "border-gray-200 hover:border-zinc-400 hover:shadow-sm"
                    }`}
                    key={carrier.id}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {carrier.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { ShippingFormData, shippingSchema } from "@/validatos/shippingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export interface ShippingFormFieldsProps {
  defaultValues?: ShippingFormData;
  onSubmit: SubmitHandler<ShippingFormData>;
  submitButtonText: string;
  isLoading: boolean;
}

export default function ShippingFormFields({
  defaultValues,
  onSubmit,
  submitButtonText,
  isLoading,
}: ShippingFormFieldsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name and surname
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street
          </label>
          <input
            {...register("street")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            {...register("city")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip code
          </label>
          <input
            {...register("postalCode")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            {...register("country")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province (optional)
          </label>
          <input
            {...register("state")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number (optional)
          </label>
          <input
            {...register("phoneNumber")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            isLoading
              ? "bg-zinc-400 cursor-not-allowed"
              : "bg-zinc-600 hover:bg-zinc-700 shadow-md hover:shadow-lg"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Przetwarzanie..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}

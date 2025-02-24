"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
});

type ShippingForm = z.infer<typeof shippingSchema>;

export default function Shipping() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit: SubmitHandler<ShippingForm> = async (data) => {
    try {
      const response = await axios.post("/api/shipping", data);

      if (response.status !== 200) {
        throw new Error("Failed to save shipping details.");
      }

      router.push("/preview/payment");
    } catch (err) {
      setError("Failed to save shipping details. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Street Address
          </label>
          <input
            type="text"
            id="street"
            {...register("street")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            {...register("city")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            {...register("postalCode")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            {...register("country")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="state"
            {...register("state")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number (optional)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register("phoneNumber")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </form>
    </div>
  );
}
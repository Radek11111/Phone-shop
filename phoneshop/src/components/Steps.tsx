"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const STEPS = [
  {
    name: "Step 1: Enter Shipping Details",
    description: "choose your shipping method and enter your details",
    url: "/checkout/shipping",
  },
  {
    name: "Step 2: Confirm your order and proceed to payment",
    description: "Check your order and proceed to payment",
    url: "/checkout/payment",
  },
  {
    name: "Step 3: Order summary",
    description: "Thank you for shopping",
    url: "/checkout/summary",
  },
];

export default function Steps() {
  const pathname = usePathname();

  return (
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-1 lg:border-r lg:border-gray-200 w-full p-0 m-0 ">
      {STEPS.map((step, i) => {
        const isCurrent = pathname.endsWith(step.url);
        const isComplete = STEPS.slice(i + 1).some((step) =>
          pathname.endsWith(step.url)
        );
        const imgPath = `/order-${i + 1}.png`;
        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1">
            <span
              className={cn(
                "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                {
                  "bg-zinc-700": isCurrent,
                  "bg-primary": isComplete,
                }
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                i !== 0 ? "lg:pl-9" : "",
                "flex items-center px-6 py-4 text-sm font-medium"
              )}
            >
              <span className="flex-shrink-0">
                <Image
                  width={80}
                  height={80}
                  src={imgPath}
                  alt=""
                  className={cn(
                    "flex h-20 w-20 object-contain items-center justify-center",
                    {
                      "border-none": isComplete,
                      "border-zinc-700": isComplete,
                    }
                  )}
                />
              </span>
              <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                <span
                  className={cn("text-sm font-bold text-zinc-700", {
                    "text-primary": isComplete,
                    "text-zinc-700": isCurrent,
                  })}
                >
                  {step.name}
                </span>
                <span className="text-sm text-zinc-500">
                  {step.description}
                </span>
              </span>
            </span>

            {/* separator */}

            {i !== 0 ? (
              <div className="absolute inset-0 hidden w-3 lg:block">
                <svg
                  className="h-full w-full text-gray-300"
                  viewBox="0 0 12 82"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0.5 0V31L10.5 41L0.5 51V82"
                    stroke="currentcolor"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

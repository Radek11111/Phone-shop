"use client";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Provider } from "react-redux";
import store from "@/store";
import FramerMotionProvider from "./FramerMotionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "bottom",
            logoImageUrl: "/assets/images/logo.svg",
          },
        }}
        signUpUrl="/sign-up"
        signInUrl="/sign-in"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      >
        <FramerMotionProvider>

        {children}
        </FramerMotionProvider>
      </ClerkProvider>
    </Provider>
  );
}

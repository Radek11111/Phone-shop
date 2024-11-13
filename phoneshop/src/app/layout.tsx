import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Providers from "@/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PhoneShop",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={recursive.className}>
          <Providers>
            <Navbar />

            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

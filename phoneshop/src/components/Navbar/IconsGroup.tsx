"use client";
import React from "react";
import { CiLogin, CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function IconsGroup() {
  const { isSignedIn } = useUser();

  const router = useRouter();

  return (
    <div className="flex items-center gap-12 relative">
      <div className="inline-flex items-center gap-6">
        <Button variant="nostyle" size="icon">
          <CiSearch size={40} className="hover:text-primary-900" />
        </Button>
        <Button
          id="openCart"
          className="hidden lg:block relative"
          variant="nostyle"
          size="icon"
        >
          <CiShoppingCart
            size={40}
            className="font-bold hover:text-primary-900"
          />
        </Button>
        {isSignedIn ? (
          <Button
            className="hidden lg:block relative"
            variant="nostyle"
            size="icon"
            onClick={() => router.push("/account/dashboard")}
          >
            <CiUser size={40} />
          </Button>
        ) : (
          <Button
            className=""
            variant="nostyle"
            size="icon"
            onClick={() => router.push("/sign-in")}
          >
            <CiLogin size={40} />
          </Button>
        )}
      </div>
    </div>
  );
}

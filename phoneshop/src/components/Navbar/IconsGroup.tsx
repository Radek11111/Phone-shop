"use client";
import React from "react";
import { CiLogin, CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CartBar from "./CartBar";
import SearchBar from "./SearchBar";

export default function IconsGroup({
  openSearchBar,
  openCartBar,
  setOpenCartBar,
  setOpenSearchBar,
}: {
  openSearchBar: boolean;
  openCartBar: boolean;
  setOpenCartBar: (value: boolean) => void;
  setOpenSearchBar: (value: boolean) => void;
}) {
  const { isSignedIn } = useUser();

  const router = useRouter();

  return (
    <div className="flex items-center relative">
      <div className="inline-flex items-center gap-1 lg:gap-3">
        <SearchBar
          openSearchBar={openSearchBar}
          setOpenSearchBar={setOpenSearchBar}
        />
        <Button
          variant="nostyle"
          size="icon"
          onClick={() => setOpenSearchBar(!openSearchBar)}
        >
          <CiSearch size={30} className="hover:text-primary-900" />
        </Button>
        <Button
          id="openCart"
          onClick={() => setOpenCartBar(!openCartBar)}
          className=""
          variant="nostyle"
          size="icon"
        >
          <CiShoppingCart
            size={30}
            className="font-bold hover:text-primary-900"
          />
          <span className="absolute flex items-center justify-center  text-white text-base -top-0 justify-items-stretch -right-2 h-5 w-5 rounded-full bg-red-700">
            0
          </span>
        </Button>
        {isSignedIn ? (
          <Button
            className=""
            variant="nostyle"
            size="icon"
            onClick={() => router.push("/account/dashboard")}
          >
            <CiUser size={30} />
          </Button>
        ) : (
          <Button
            className=""
            variant="nostyle"
            size="icon"
            onClick={() => router.push("/sign-in")}
          >
            <CiLogin size={30} />
          </Button>
        )}
        <CartBar openCartBar={openCartBar} setOpenCartBar={setOpenCartBar} />
      </div>
    </div>
  );
}

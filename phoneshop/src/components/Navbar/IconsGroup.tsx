"use client";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { SlHeart } from "react-icons/sl";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import {
  CiHeart,
  CiLogin,
  CiSearch,
  CiShop,
  CiShoppingCart,
  CiUser,
} from "react-icons/ci";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CartBar from "./CartBar";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Link from "next/link";

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
  const cart = useSelector((state: IRootState) => state.cart.cartItems);

  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setItemsCount(cart.reduce((total, item) => total + item.qty, 0));
  }, [cart]);

  return (
    <>
      <div className="hidden lg:flex items-center gap-5">
        <div className="p-5">
          <Link
            href="/store"
            className="flex items-center gap-2  hover:font-bold transition-transform hover:scale-110"
          >
            <CiShop size={30} className=" " />{" "}
            <span className="hover:font-bold">Store</span>
          </Link>
        </div>
        <div className="">
          <Link
            href="/favorites"
            className="flex items-center gap-2 transition-transform hover:scale-110"
            onMouseEnter={() => setIsFavoriteHovered(true)}
            onMouseLeave={() => setIsFavoriteHovered(false)}
          >
            {isFavoriteHovered ? (
              <FaHeart size={30} className="text-red-600 transition-all" />
            ) : (
              <RiHeart3Line size={30} className="transition-all" />
            )}
            <span className="hover:font-bold">Favorite</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-1 lg:gap-3">
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
        </div>

        <div className="flex items-center gap-1 lg:gap-3">
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
            <span className="absolute flex items-center justify-center text-white text-sm -top-0 justify-items-stretch -right-1 h-4 w-4 rounded-full bg-red-700">
              {itemsCount}
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
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
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
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  const cart = useSelector((state: IRootState) => state.cart.cartItems || []);

  const [isFavorite, setIsFavorite] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (Array.isArray(cart)) {
      setItemsCount(cart.reduce((total, item) => total + item.qty, 0));
    } else {
      setItemsCount(0);
    }
  }, [cart]);

  return (
    <>
      <div className="hidden lg:flex items-center gap-5">
        <div className="p-5">
          <Button
            variant="nostyle"
            onClick={() => router.push("/store")}
            className="rounded-full p-2 hover:bg-gray-200 transition font-extrabold"
          >
            <CiShop
              size={35}
              className="text-gray-900 transition-transform duration-200 hover:scale-110 hover:font-extrabold"
            />
          </Button>
        </div>
        <div className="">
          <Button
            variant="nostyle"
            className="rounded-full p-2 transition"
            onMouseEnter={() => setIsFavorite(true)}
            onMouseLeave={() => setIsFavorite(false)}
          >
            {isFavorite ? (
              <FavoriteIcon
                fontSize="large"
                className="text-red-500 transition-colors duration-200"
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                fontSize="large"
                className="text-gray-700  hover:text-red-600 transition-colors duration-200"
              />
            )}
          </Button>
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

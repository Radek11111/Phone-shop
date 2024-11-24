"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { m, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { ShoppingBasket } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CartBar({
  openCartBar,
  setOpenCartBar,
}: {
  openCartBar: boolean;
  setOpenCartBar: (v: boolean) => void;
}) {
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {openCartBar && (
        <m.div
          onMouseLeave={() => setOpenCartBar(!openCartBar)}
          exit={{
            y: -20,
            opacity: 0,
            filter: "blur(5px)",
            scale: "scale(0)",
            transition: { ease: "easeIn", duration: 0.22 },
          }}
          initial={{ opacity: 0, y: -15 }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", duration: 0.7 },
          }}
          className="absolute top-[54px] right-0 h-fit w-[360px] bg-white z-[9999] p-4 shadow-2xl"
        >
          <p className="text-center">
            {cart.length > 0
              ? `You have ${cart.length} items in your cart`
              : "Your cart is empty"}
          </p>
          {cart.length > 0 ? (
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="border-b p-2">
                  <span>{item.name}</span> - ${item.price} x {item.amount}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-1 items-center">
              <ShoppingBasket className="text-slate-700 font-bold" size={100} />
              <h5 className="">Your cart is empty</h5>

              <Button className="bg-green-400 border capitalize border-slate-200">
                <Link href="/products">shop now</Link>
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between font-bold">
              <h6>Subtotal:</h6>
              <strong className="">value</strong>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/cart"
              className="rounded-sm py-4 flex justify-center hover:bg-black hover:text-white capitalize text-xl border border-border"
            >
              view cart
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

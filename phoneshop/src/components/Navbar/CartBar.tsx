"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { m, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { addToCart } from "@/store/cartSlice"; 


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
                <li
                  key={item.id} 
                  className="border-b p-2"
                >
                  <span>{item.name}</span> - ${item.price} x {item.amount}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center mt-4 text-gray-500">
              Your cart is empty. Add some items to your cart!
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}

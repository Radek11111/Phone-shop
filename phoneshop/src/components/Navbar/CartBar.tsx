"use client";
import React, { useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { ShoppingBasket, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { removeProductById } from "@/store/cartSlice";
import ShinyText from "../ShinyText";

export default function CartBar({
  openCartBar,
  setOpenCartBar,
}: {
  openCartBar: boolean;
  setOpenCartBar: (v: boolean) => void;
}) {
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleRemoveItem = (item: { id: string }) => {
    dispatch(removeProductById(item.id));
  };

  const totalPrice = cart
    .reduce((total, item) => total + item.price * item.qty, 0)
    .toFixed(2);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Koszyk w localStorage:", cart);
  }, [cart]);

  return (
    <AnimatePresence>
      {openCartBar && (
        <m.div
          onMouseLeave={() => setOpenCartBar(!openCartBar)}
          exit={{
            y: -20,
            opacity: 0,
            scale: 0,
            transition: { ease: "easeIn", duration: 0.22 },
          }}
          initial={{ opacity: 0, y: -15 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { type: "spring", duration: 0.7 },
          }}
          className="absolute top-[54px] right-0 h-fit w-[400px] bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-md z-[9999] p-6 rounded-2xl shadow-xl border border-gray-200/50"
        >
          
          <p className="text-center text-lg font-semibold text-gray-800">
            {cart.length > 0
              ? `Your Cart (${cart.length} items)`
              : "Your Cart is Empty"}
          </p>

          
          <div className="flex flex-col snap-y gap-4 border-b border-gray-300/50 pb-4 max-h-[400px] overflow-y-auto mt-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  className="flex justify-between gap-4 snap-center bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  key={item.id}
                >
                  <Image
                    src={item.thumbnail}
                    width={80}
                    height={80}
                    alt="product"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="capitalize text-sm font-medium text-gray-900">
                      {item.name.substring(0, 30)}
                    </span>
                    <div className="inline-flex gap-4 font-bold text-gray-700">
                      <span>${item.price.toFixed(2)}</span>
                      <span className="text-gray-500">× {item.qty}</span>
                    </div>
                  </div>
                  <div
                    role="button"
                    onClick={() => handleRemoveItem(item)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200/50 hover:bg-red-100 transition-colors duration-200"
                  >
                    <Trash className="text-red-500 hover:text-red-600" size={18} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-4 items-center py-6">
                <ShoppingBasket
                  className="text-gray-500"
                  size={80}
                />
                <h5 className="text-gray-600 font-medium">Nothing here yet!</h5>
                <Button className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/store">Shop Now</Link>
                </Button>
              </div>
            )}
          </div>

          
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <h6>Total:</h6>
              <strong>${totalPrice}</strong>
            </div>
          </div>

          
          <div className="flex flex-col gap-4 mt-4">
            <Link
              href="/cart"
              className="rounded-full py-3 flex justify-center bg-gradient-to-r from-zinc-600 to-zinc-600 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ShinyText text="View Cart"/>
              
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
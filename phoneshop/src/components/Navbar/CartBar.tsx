"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { m, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { addToCart } from "@/store/cartSlice"; // Import the action to update the Redux state

export default function CartBar({
  openCartBar,
  setOpenCartBar,
}: {
  openCartBar: boolean;
  setOpenCartBar: (v: boolean) => void;
}) {
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch data from the API when the component mounts using Axios
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/carts/1"); // Example endpoint
        const data = response.data;

        // Assuming data.products contains an array of items
        data.products.forEach((item: any) => {
          dispatch(
            addToCart({
              id: item.id,
              name: item.title,
              price: item.price,
              amount: item.quantity,
            })
          );
        });
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      }
    };

    fetchCartItems();
  }, [dispatch]);

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
                  key={`${item.id}-${item.name}`} // Composite key: item.id + item.name
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

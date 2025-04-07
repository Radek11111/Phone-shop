"use client";
import { IRootState } from "@/store";
import {
  
  removeProductById,
  updateCart,
} from "@/store/cartSlice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ShinyText from "@/components/ShinyText";
import { CartItem } from "@/types";


export default function Cart() {
  const [hydrated, setHydrated] = useState(false);
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (!hydrated) return null;

  const handleRemoveItem = (item: { id: string }) => {
    dispatch(removeProductById(item.id));
  };

  const handleUpdateQty = (item: { id: string }, qty: number) => {
    if (qty > 0) {
      dispatch(updateCart({ id: item.id, qty }));
    }
  };

  const subtotal = cart.reduce(
    (accumulator: number, currentValue: CartItem) =>
      accumulator + currentValue.price * currentValue.qty,
    0
  );

  const handleProceedOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
 
    router.push("/checkout/shipping");
  };

  return (
    <div className="p-4 ">
      {cart.length > 0 ? (
        <div className="grid gap-4 ">
          {cart.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-4 p-4 shadow-md "
            >
              <Image
                src={item.thumbnail}
                width={150}
                height={150}
                alt={item.title}
                className="rounded-lg"
              />
              <CardContent className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={() => handleUpdateQty(item, item.qty - 1)}
                    variant="secondary"
                    className="hover:bg-slate-200"
                  >
                    -
                  </Button>
                  <span className="text-gray-800 font-bold">{item.qty}</span>
                  <Button
                    onClick={() => handleUpdateQty(item, item.qty + 1)}
                    variant="secondary"
                    className="hover:bg-slate-200"
                  >
                    +
                  </Button>
                </div>
                <p className="text-gray-800 font-bold mt-2">
                  Total: ${(item.price * item.qty).toFixed(2)}
                </p>
              </CardContent>
              <Button
                onClick={() => handleRemoveItem(item)}
                className="mt-2 md:mt-0 bg-slate-600"
              >
                Remove
              </Button>
            </Card>
          ))}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-right">
            <p className="text-xl font-bold">
              Subtotal: ${subtotal.toFixed(2)}
            </p>
            <Button
              onClick={handleProceedOrder}
              className="rounded-full mt-4  bg-gradient-to-r from-zinc-600 to-zinc-600 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ShinyText text="Proceed to Shipping" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-600 mt-2">Start adding items to your cart!</p>
        </div>
      )}
    </div>
  );
}
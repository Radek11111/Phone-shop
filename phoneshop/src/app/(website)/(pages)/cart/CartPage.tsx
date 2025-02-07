"use client";
import { IRootState } from "@/store";
import { removeProductById, updateToCart } from "@/store/cartSlice";
import { CartItem } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [hydrated, setHydrated] = useState(false);
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleRemoveItem = (item: { id: string | number }) => {
    dispatch(removeProductById(item.id));
  };

  const handleUpdateQty = (item: { id: string | number }, qty: number) => {
    if (qty > 0) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, qty } : cartItem
      );
      dispatch(updateToCart(updatedCart));
    }
  };

  const subtotal = cart.reduce(
    (accumulator: number, currentValue: CartItem) =>
      accumulator + currentValue.price * currentValue.qty,
    0
  );

  const handlePreview = () => {
    router.push("/preview"); 
  };

  return (
    <div className="p-4">
     
      {cart.length > 0 ? (
        <div className="grid gap-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 shadow-md">
              <Image
                src={item.thumbnail}
                width={150}
                height={150}
                alt={item.title}
                className="rounded-lg"
              />
              <CardContent className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={() => handleUpdateQty(item, item.qty - 1)}
                    variant="secondary"
                  >
                    -
                  </Button>
                  <span className="text-gray-800 font-bold">{item.qty}</span>
                  <Button
                    onClick={() => handleUpdateQty(item, item.qty + 1)}
                    variant="secondary"
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
                variant="destructive"
                className="mt-2 md:mt-0"
              >
                Remove
              </Button>
            </Card>
          ))}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-right">
            <p className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
            <Button
              onClick={handlePreview}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Proceed your order
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

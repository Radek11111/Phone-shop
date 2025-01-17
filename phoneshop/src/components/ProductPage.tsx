"use client";

import React, { useEffect, useState } from "react";
import type { Product, CartItem } from "@/types";
import Container from "@/components/Container";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateToCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IRootState } from "@/store";


export default function ProductPage({ product }: { product: Product | null }) {
  const cart = useSelector((state: IRootState) => state.cart);
  const [qty, setQty] = useState<number>(1);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const cartItem = cart.cartItems.find(
      (item: CartItem) => item.id === product?.id
    );
    if (cartItem) {
      setQty(cartItem.qty);
    }
  }, [cart, product]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingItem = cart.cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.cartItems.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      );
      dispatch(updateToCart(updatedCart));
      toast.success("Cart updated");
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          amount: product.price * qty,
          qty,
        })
      );
      toast.success("Product added to cart");
    }
  };

  const updateQty = (action: "inc" | "dec") => {
    if (action === "dec" && qty === 1) {
      toast.error("You have reached the minimum quantity");
      return;
    }

    if (action === "inc" && qty === 9) {
      toast.error("You have reached the maximum quantity");
      return;
    }

    setQty((prevQty) => (action === "dec" ? prevQty - 1 : prevQty + 1));
  };

  return (
    <section className="my-10 flex justify-center items-center">
      <Container>
       
        <h1 className="text-3xl font-bold mb-8 text-center">{product.title}</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <Zoom>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="rounded shadow-lg object-cover max-w-full md:max-w-2xl w-full lg:max-w-screen-2xl"
            />
          </Zoom>

          <div className="flex-1 max-w-lg">
            <p className="text-lg text-gray-700 text-center md:text-left">
              {product.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <div className="flex justify-between items-center mt-6 gap-4 w-full max-w-lg">
            <Button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 font-bold text-white bg-green-500 rounded-lg shadow-md transition-transform hover:bg-green-600 hover:shadow-lg"
            >
              Add to cart
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => updateQty("dec")}
                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                -
              </Button>
              <span className="text-lg font-bold">{qty}</span>
              <Button
                onClick={() => updateQty("inc")}
                className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

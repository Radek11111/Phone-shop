"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import Container from "@/components/Container";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, CartItemRedux, updateCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IRootState } from "@/store";
import ShinyText from "@/components/ShinyText";
import { m } from "framer-motion";

export default function ProductPage({ product }: { product: Product | null }) {
  const cart = useSelector((state: IRootState) => state.cart);
  const [qty, setQty] = useState<number>(1);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const cartItem = cart.cartItems.find(
      (item: CartItemRedux) => item.id === product?.id
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
      dispatch(updateCart({ id: product.id, qty: existingItem.qty + qty }));
      toast.success("Cart updated");
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
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
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12"
        >
          {/* Tytuł z gradientem */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {product.title}
          </h1>

          {/* Główny kontener */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Obraz z efektem zoom */}
            <div className="relative w-full md:w-1/2 max-w-2xl">
              <Zoom>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="rounded-xl shadow-2xl object-cover w-full transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-gray-100 to-gray-200"
                />
              </Zoom>
            </div>

            {/* Opis, cena i przyciski */}
            <div className="flex-1 max-w-lg space-y-6 flex flex-col">
              <p className="text-lg text-gray-600 leading-relaxed text-center md:text-left">
                {product.description}
              </p>
              <span className="block text-3xl font-extrabold text-indigo-700 text-center md:text-left">
                ${product.price.toFixed(2)}
              </span>

              {/* Sekcja przycisków */}
              <div className="flex flex-row items-center justify-center md:justify-end gap-4 mt-6">
                {/* Przycisk "Add to Cart" */}
                <Button
                  onClick={handleAddToCart}
                  className="relative px-10 py-6 font-bold text-2xl right-3 mt-11 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <ShinyText text="Add to Cart"  />
                  <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-20 bg-white transition-opacity duration-300"></span>
                </Button>

                {/* Licznik ilości */}
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-full shadow-md mt-11">
                  <Button
                    onClick={() => updateQty("dec")}
                    className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:bg-indigo-600 hover:shadow-md"
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold text-gray-800 w-12 text-center">
                    {qty}
                  </span>
                  <Button
                    onClick={() => updateQty("inc")}
                    className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:bg-indigo-600 hover:shadow-md"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
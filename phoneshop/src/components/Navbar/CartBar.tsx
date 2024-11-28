"use client";



import { m, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";

import { ShoppingBasket, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { removeProductById } from "@/store/cartSlice";

export default function CartBar({
  openCartBar,
  setOpenCartBar,
}: {
  openCartBar: boolean;
  setOpenCartBar: (v: boolean) => void;
}) {
  const cart = useSelector((state: IRootState) => state.cart.cartItems);
  const dispach = useDispatch();

  const handleRemoveItem = (item: { id: string | number }) => {
    dispach(removeProductById(String(item.id)));
  };

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
                <div
                  className="flex justify-between gap-4 snap-center cursor-grab"
                  key={item.id}
                >
                  <Image
                    src={item.thumbnail}
                    width="200"
                    height="200"
                    alt="prod"
                    className="h-20 w-20 object-cover"
                  />
                  <div className="flex flex-col gap-1 ">
                    <span className="capitalize">
                      {item.name.substring(0, 30)}
                    </span>
                    <div className="inline-flex gap-4 font-bold">
                      <span>{item.price}$</span>
                    </div>
                  </div>
                  <div
                    role="button"
                    onClick={() => handleRemoveItem(item)}
                    className="flex items-start"
                  >
                    <Trash className="hover:text-primary-500" size={20} />
                  </div>
                </div>
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
              <strong className="">{}</strong>
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

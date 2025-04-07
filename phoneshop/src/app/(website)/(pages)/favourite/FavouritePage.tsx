"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "../../../../../actions/product";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "../../../../store";
import { toggleFavourite } from "../../../../store/favouritesSlice";
import { FaTrashAlt } from "react-icons/fa";
import { CartItem } from "@/types";

export default function FavouritePage() {
  const router = useRouter();
  const [products, setProducts] = useState<CartItem[]>([]);
  const dispatch = useDispatch();
  const { likedProducts } = useSelector(
    (state: IRootState) => state.favourites
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts();
      if (!result.error) {
        setProducts(result.products || []);
      }
    };

    fetchProducts();
  }, []);

  const favouriteProducts = products.filter((item) =>
    likedProducts.includes(item.id)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center mt-8">
      {favouriteProducts.length > 0 ? (
        favouriteProducts.map((item) => (
          <div
            key={item.id}
            className="group relative cursor-pointer flex flex-col items-center p-4 border rounded-md hover:shadow-lg transition-shadow bg-white"
            onClick={() => router.push(`/products/${item.id}`)}
          >
            <div
              className="absolute top-2 right-2 cursor-pointer z-10 "
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFavourite(item.id));
              }}
            >
              <FaTrashAlt
                size={30}
                className="text-gray-600 hover:text-red-600 transition-all"
              />
            </div>
            <Image
              src={item.thumbnail}
              height={120}
              width={100}
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              alt={item.title}
            />
            <h3 className="text-slate-800 mb-1 mt-4 text-center">
              {item.title}
            </h3>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No favourites yet.</p>
      )}
    </div>
  );
}

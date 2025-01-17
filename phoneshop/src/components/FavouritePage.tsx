"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "../../actions/product";
import { Product } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FavouritePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(
    new Set(JSON.parse(localStorage.getItem("likedProducts") || "[]"))
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
    likedProducts.has(item.id)
  );

  return (
    <div className="flex flex-wrap gap-6 justify-center mt-8">
      {favouriteProducts.length > 0 ? (
        favouriteProducts.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer flex flex-col items-center p-4 border rounded-md hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/products/${item.id}`)}
          >
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

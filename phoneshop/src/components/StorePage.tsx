"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "../../actions/product";
import type { Product } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pagination } from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { RiHeart3Line } from "react-icons/ri";

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(
    new Set(JSON.parse(localStorage.getItem("likedProducts") || "[]"))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const perPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts();
        if (result.error) {
          setError(result.error);
        } else {
          setProducts(result.products || []);
        }
      } catch (err: any) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "likedProducts",
      JSON.stringify(Array.from(likedProducts))
    );
  }, [likedProducts]);

  const toggleLike = (id: number) => {
    setLikedProducts((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedProducts = products.slice(
    (page - 1) * perPage,
    page * perPage
  );
  const pageCount = Math.ceil(products.length / perPage);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-8">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-6 justify-center mt-8">
        {paginatedProducts.map((item: Product) => (
          <div
            key={item.id}
            className="group relative cursor-pointer flex flex-col items-center p-4 border rounded-md hover:shadow-lg transition-shadow"
          >
            {/* Ikona serca w prawym górnym rogu */}
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => toggleLike(item.id)}
            >
              {likedProducts.has(item.id) ? (
                <FaHeart size={30} className="text-red-600 transition-all" />
              ) : (
                <RiHeart3Line size={30} className="transition-all" />
              )}
            </div>
            <Image
              src={item.thumbnail}
              height={120}
              width={100}
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              alt={item.title}
              onClick={() => router.push(`/products/${item.id}`)}
            />
            <h3 className="text-slate-800 mb-1 mt-4 text-center">
              {item.title}
            </h3>
            <p className="pt-0 text-center text-gray-600">
              {item.description.length > 50
                ? `${item.description.substring(0, 50)} ...`
                : item.description}
            </p>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="py-10 flex flex-col items-center mt-auto">
        <Pagination
          count={pageCount}
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />

        <div className="mt-4 text-sm text-slate-400">
          Showing {(page - 1) * perPage + 1} to{" "}
          {Math.min(page * perPage, products.length)} of {products.length}{" "}
          results
        </div>
      </div>
      <button
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => router.push("/favourite")}
      >
        Go to Favourites
      </button>
    </>
  );
}

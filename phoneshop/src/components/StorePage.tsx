"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "../../actions/product";
import type { Product } from "@/types";

export default function StorePage({ product }: { product: Product | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts();
      if (result.error) {
        setError(result.error);
      } else {
        setProducts(result.products || []);
      }
    };

    fetchProducts();
  }, [product]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <h2>{product.title}</h2>
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

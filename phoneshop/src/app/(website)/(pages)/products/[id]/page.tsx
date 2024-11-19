import React from "react";
import { Product } from "@/types";
import { getProductById } from "../../../../../../actions/product";

export default async function page({ params }: { params: { id: string } }) {
  const product: Product | any = await getProductById(params.id);

  if (!product || product.error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

    return (
      
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} className="mb-4" />
      <p className="text-lg">{product.description}</p>
    </div>
  );
}

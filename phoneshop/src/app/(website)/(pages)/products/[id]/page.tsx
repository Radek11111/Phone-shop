import React from "react";
import ProductPage from "@/components/ProductPage";
import { getProductById } from "../../../../../../actions/product";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id); 

  return (
    <ProductPage product={product} /> 
  );
}

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";

const fetchProductDetail = async (id: string | string[] | null) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const ProductDetail = ({ id }: { id: string | string[] | null }) => {
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id], // queryKey jako pierwszy argument w obiekcie
    queryFn: () => fetchProductDetail(id), // queryFn jako drugi argument w obiekcie
    enabled: !!id, // Opcja konfiguracji jako część tego samego obiektu
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} />
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <h1>Product Detail</h1>
      {id ? <ProductDetail id={id} /> : <div>No product ID provided</div>}
    </div>
  );
};

export default Page;

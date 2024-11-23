"use client"

import React from "react";
import { Product } from "@/types";
import { getProductById } from "../../../../../../actions/product";
import Container from "@/components/Container";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


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
    <>
      <section className="my-10 flex justify-center items-center">
        <Container>
          <h1 className="text-3xl font-bold mb-8 text-center">
            {product.title}
          </h1>
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

          <div className="flex justify-center mt-6">
            <Button
              
              role="combobox"
              className={cn(
                "w-full px-6 py-2 font-bold text-white bg-green-500 rounded transition-transform",
                "hover:bg-green-600 hover:scale-105 hover:shadow-lg",
                "active:bg-green-700 focus:ring-2 focus:ring-green-300"
              )}
              style={{
                maxWidth: "calc(100% - 40px)",
              }}
            >
              Add to cart
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

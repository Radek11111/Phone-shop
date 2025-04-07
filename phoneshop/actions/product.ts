"use server";
import { CartItem } from "@/types";
import axios from "axios";

export const getProductById = async (
  id: string | number
): Promise<CartItem | null> => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `/products/${id}`
    );
    return response.data as CartItem; 
  } catch (error: any) {
    console.error("Błąd podczas pobierania produktu:", error.message);
    return null; 
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/products/search?q=phone"
    );
    return response.data;
  } catch (error: any) {
    return { error: error.message };
  }
};

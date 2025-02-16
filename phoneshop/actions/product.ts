import axios from "axios";

export const getProductById = async (id: string | number) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `/products/${id}`
    );
    return response.data;
  } catch (error: any) {
    return { error: error.message };
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

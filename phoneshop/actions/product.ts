import axios from "axios";

export const getProductById = async (id: string | number) => {
    try {

        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
};

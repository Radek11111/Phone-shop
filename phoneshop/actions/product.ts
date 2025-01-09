import axios from "axios";

export const getProductById = async (id: string | number) => {
    try {

        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
};

export const getProducts = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products/search?q=phone');
        return response.data;
        
    } catch (error: any) {
        return { error: error.message };
    }
}
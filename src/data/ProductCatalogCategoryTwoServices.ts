import axios, { AxiosError } from 'axios';
import { toast } from "sonner";

const ProductCategory2Service = {
    async getProductCategories() {
        try {
            const response = await axios.get("ProductCatalogCategoryTwo/all");
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async getProductCategoryById(categoryId: number) {
        try {
            const response = await axios.get(`ProductCatalogCategoryTwo/${categoryId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async createProductCategory(categoryData: any) {
        try {
            const response = await axios.post("ProductCatalogCategoryTwo/", categoryData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async updateProductCategory(categoryId: number, categoryData: any) {
        try {
            const response = await axios.put(`ProductCatalogCategoryTwo/${categoryId}`, categoryData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async deleteProductCategory(categoryId: number) {
        try {
            const response = await axios.delete(`ProductCatalogCategoryTwo/${categoryId}`);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    }
};

export default ProductCategory2Service;

import axios, { AxiosError } from 'axios';
import { toast } from "sonner";

const SizeService = {
    async getSizes() {
        try {
            const response = await axios.get("size/all");
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async getSizeById(sizeId: number) {
        try {
            const response = await axios.get(`size/${sizeId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async createSize(sizeData: any) {
        try {
            const response = await axios.post("size/", sizeData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async updateSize(sizeId: number, sizeData: any) {
        try {
            const response = await axios.put(`size/${sizeId}`, sizeData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async deleteSize(sizeId: number) {
        try {
            const response = await axios.delete(`size/${sizeId}`);
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

export default SizeService;

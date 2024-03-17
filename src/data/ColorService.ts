import axios, {AxiosError} from 'axios';
import {toast} from "sonner";

const ColorService = {
    async getColors() {
        try {
            const response = await axios.get("color/all");
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    },

    async getColorById(colorId) {
        try {
            const response = await axios.get(`color/${colorId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    },

    async createColor(colorData) {
        try {
            const response = await axios.post("color/", colorData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    },

    async updateColor(colorId, colorData) {
        try {
            const response = await axios.put(`color/${colorId}`, colorData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    },

    async deleteColor(colorId) {
        try {
            const response = await axios.delete(`color/${colorId}`);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    }
};

export default ColorService;

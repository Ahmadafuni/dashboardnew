import axios, { AxiosError } from 'axios';
import { toast } from "sonner";

const TemplateTypeService = {
    async getTemplateTypes() {
        try {
            const response = await axios.get("TemplateType/all");
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async getTemplateTypeById(typeId: number) {
        try {
            const response = await axios.get(`TemplateType/${typeId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async createTemplateType(typeData: any) {
        try {
            const response = await axios.post("TemplateType/", typeData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async updateTemplateType(typeId: number, typeData: any) {
        try {
            const response = await axios.put(`TemplateType/${typeId}`, typeData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async deleteTemplateType(typeId: number) {
        try {
            const response = await axios.delete(`TemplateType/${typeId}`);
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

export default TemplateTypeService;

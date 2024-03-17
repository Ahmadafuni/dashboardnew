import axios, { AxiosError } from 'axios';
import { toast } from "sonner";

const TemplatePatternService = {
    async getTemplatePatterns() {
        try {
            const response = await axios.get("TemplatePatter/all");
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async getTemplatePatternById(patternId: number) {
        try {
            const response = await axios.get(`TemplatePatter/${patternId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async createTemplatePattern(patternData: any) {
        try {
            const response = await axios.post("TemplatePatter/", patternData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async updateTemplatePattern(patternId: number, patternData: any) {
        try {
            const response = await axios.put(`TemplatePatter/${patternId}`, patternData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            throw error;
        }
    },

    async deleteTemplatePattern(patternId: number) {
        try {
            const response = await axios.delete(`TemplatePatter/${patternId}`);
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

export default TemplatePatternService;

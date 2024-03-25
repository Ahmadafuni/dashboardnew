import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import {templateSizeSchema} from "@/form_schemas/newTemplateSizeSchema.ts";
import TemplateSizeForm from "@/components/DashboradComponents/TemplateSizes/TemplateSizeForm.tsx";

export default function NewTemplateSizes () {
    const { t } = useTranslation();
    const { templateId } = useParams<{ templateId: string }>(); // Ensure templateId is of type string
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof templateSizeSchema>>({
        resolver: zodResolver(templateSizeSchema),
        defaultValues: {
            TemplateId: "",
            SizeId: "",
            TemplateSizeType: "CUTTING",
            Description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof templateSizeSchema>) => {
        setIsLoading(true);
        try {

            const newTemplateSize = await axios.post("templatesize/",
                {
                    ...data,
                    TemplateId: templateId,
                    SizeId: data.SizeId,
                    TemplateSizeType: data.TemplateSizeType,
                    Description: data.Description,
                },
                {
                headers: {
                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newTemplateSize.data.message);
            form.reset();
            setIsLoading(false);
            navigate("/dashboard/templates");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message ?? t("An error occurred"));
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-1">
            <TemplateSizeForm form={form} onSubmit={onSubmit} />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} form="templatesize">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        t("Add")
                    )}
                </Button>
            </div>
        </div>
    );
};

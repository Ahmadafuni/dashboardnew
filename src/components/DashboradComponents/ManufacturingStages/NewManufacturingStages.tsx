import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import ManufacturingStageForm from "@/components/DashboradComponents/ManufacturingStages/ManufacturingStageForm.tsx";
import {manufacturingStageSchema} from "@/form_schemas/newManufacturingStageSchema.ts";


export default function NewManufacturingStages() {
    const { t } = useTranslation();
    const { templateId } = useParams<{ templateId: string }>(); // Ensure templateId is of type string
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof manufacturingStageSchema>>({
        resolver: zodResolver(manufacturingStageSchema),
        defaultValues: {
            TemplateId: templateId,
            DepartmentId: "",
            StageNumber: 0,
            StageName: "",
            WorkDescription: "",
            Duration: 0,
            Description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof manufacturingStageSchema>) => {
        setIsLoading(true);
        try {
            const newManufacturingStage = await axios.post(
                "manufacturingstage/",
                {
                    ...data,
                    TemplateId: templateId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(newManufacturingStage.data.message);
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
            <div className="w-full space-y-1 flex items-center">
                <ArrowLeft className="m-1 cursor-pointer" onClick={() => {navigate(-1)}} />
                <h1 className="text-3xl font-bold">{t("TemplateSizes")}</h1>
            </div>
            <ManufacturingStageForm form={form} onSubmit={onSubmit} />
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
}

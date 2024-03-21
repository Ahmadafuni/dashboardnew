import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    templatePattern,
    templatePatternId,
    updateTemplatePatternModal,
} from "@/store/TemplatePattern.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { newTemplatePatternSchema } from "@/form_schemas/newTemplatePatternSchema.ts";
import TemplatePatternDialog from "@/components/DashboradComponents/Entities/TemplatePattern/TemplatePatternDialog.tsx";
import {useTranslation} from "react-i18next";

type Props = {
    getTemplatePatterns: () => void;
};

export default function UpdateTemplatePattern({ getTemplatePatterns }: Props) {
    const templatePatternID = useRecoilValue(templatePatternId);
    const [open, setOpen] = useRecoilState(updateTemplatePatternModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentTemplatePattern = useRecoilValue(templatePattern);
    const { t } = useTranslation();
    const form = useForm({
        resolver: zodResolver(newTemplatePatternSchema),
        defaultValues: currentTemplatePattern,
    });

    const onSubmit = async (data: z.infer<typeof newTemplatePatternSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`templatePattern/${templatePatternID}`, data);
            toast.success(response.data.message);
            getTemplatePatterns(); // Refresh template patterns after update
            setIsLoading(false);
            setOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("UpdateTemplatePattern")}</DialogTitle>
                </DialogHeader>
                <TemplatePatternDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button type="submit" disabled={isLoading} form="templatePatternForm">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            t("Update")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

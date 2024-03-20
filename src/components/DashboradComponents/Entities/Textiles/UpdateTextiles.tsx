import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    textile,
    textileId,
    updateTextileModal,
} from "@/store/Textiles.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { newTextilesSchema } from "@/form_schemas/newTextilesSchema.ts";
import TextilesDialog from "@/components/DashboradComponents/Entities/Textiles/TextilesDialog.tsx";
import {useTranslation} from "react-i18next";

type Props = {
    getTextiles: () => void;
};

export default function UpdateTextiles({ getTextiles }: Props) {
    const textilesID = useRecoilValue(textileId);
    const [open, setOpen] = useRecoilState(updateTextileModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentTextiles = useRecoilValue(textile);
    const { t } = useTranslation();
    const form = useForm({
        resolver: zodResolver(newTextilesSchema),
        defaultValues: currentTextiles,
    });

    const onSubmit = async (data: z.infer<typeof newTextilesSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`textiles/${textilesID}`, data);
            toast.success(response.data.message);
            getTextiles(); // Refresh textiles after update
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
                    <DialogTitle>{t("UpdateTextile")}</DialogTitle>
                </DialogHeader>
                <TextilesDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button type="submit" disabled={isLoading} form="textilesForm">
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

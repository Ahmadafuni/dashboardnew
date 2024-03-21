import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { newTextilesSchema } from "@/form_schemas/newTextilesSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import TextilesDialog from "@/components/DashboradComponents/Entities/Textiles/TextilesDialog.tsx";
import {TextilesType} from "@/types/Entities/Textiles.types.ts";
import {newTextileModal} from "@/store/Textiles.ts";
import {useTranslation} from "react-i18next";

type Props = {
    getTextiles: any;
};

export default function NewTextiles({ getTextiles }: Props) {
    const [open, setOpen] = useRecoilState(newTextileModal);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const form = useForm<TextilesType>({
        resolver: zodResolver(newTextilesSchema),
        defaultValues: {
            TextileName: "",
            TextileType: "",
            Composition: "",
            Description: "",
        },
    });

    const onSubmit = async (data: TextilesType) => {
        setIsLoading(true);
        try {
            const newTextile = await axios.post("textiles", data);
            toast.success(newTextile.data.message);
            getTextiles();
            form.reset();
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
                    <DialogTitle>{t("NewTextile")}</DialogTitle>
                </DialogHeader>
                <TextilesDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            t("Add")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { colorSchema } from "@/form_schemas/newColorSchema.ts";
import { newColorModal } from "@/store/Color.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import ColorsDialog from "@/components/DashboradComponents/Entities/Colors/ColorsDialog.tsx";
import {useTranslation} from "react-i18next";

type Props = {
    getColors: any;
};

export default function NewColor({ getColors }: Props) {
    const [open, setOpen] = useRecoilState(newColorModal);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof colorSchema>>({
        resolver: zodResolver(colorSchema),
        defaultValues: {
            ColorName: "",
            ColorCode: "",
            Description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof colorSchema>) => {
        setIsLoading(true);
        try {
            const newColor = await axios.post("colors", data); // Assuming the endpoint for creating a color is "/colors"
            toast.success(newColor.data.message);
            getColors(); // Function to fetch colors after successful creation
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
                    <DialogTitle> {t("NewColor")}</DialogTitle>
                </DialogHeader>
                <ColorsDialog form={form} onSubmit={onSubmit} />
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

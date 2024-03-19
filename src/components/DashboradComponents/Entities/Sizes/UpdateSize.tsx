import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { size, sizeId, updateSizeModal } from "@/store/Sizes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import {SizeSchema} from "@/form_schemas/newSizeSchema.ts";
import SizesDialog from "@/components/DashboradComponents/Entities/Sizes/SizesDialog.tsx";

type Props = {
    getSizes: () => void;
};

export default function UpdateSize({ getSizes }: Props) {
    const sizeID = useRecoilValue(sizeId);
    const [open, setOpen] = useRecoilState(updateSizeModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentSize = useRecoilValue(size);
    const form = useForm({
        resolver: zodResolver(SizeSchema),
        defaultValues: currentSize,
    });

    const onSubmit = async (data: z.infer<typeof SizeSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`sizes/${sizeID}`, data);
            toast.success(response.data.message);
            getSizes(); // Refresh sizes after update
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
                    <DialogTitle>Update Size</DialogTitle>
                </DialogHeader>
                <SizesDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isLoading} form="sizeForm">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

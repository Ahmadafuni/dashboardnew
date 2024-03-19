import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
    productCategoryTwo,
    productCategoryTwoId,
    updateProductCategoryTwoModal,
} from "@/store/ProductCategoryTwo.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import ProductCategoryTwoDialog from "@/components/DashboradComponents/Entities/ProductCategoryTwo/ProductCategoryTwoDialog.tsx";
import {ProductCategoryTwoSchema} from "@/form_schemas/newProductCategoryTwoSchema.ts";

type Props = {
    getProductCategoriesTwo: () => void;
};

export default function UpdateProductCategoryTwo({ getProductCategoriesTwo }: Props) {
    const productCategoryTwoID = useRecoilValue(productCategoryTwoId);
    const [open, setOpen] = useRecoilState(updateProductCategoryTwoModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentProductCategoryTwo = useRecoilValue(productCategoryTwo);
    const form = useForm({
        resolver: zodResolver(ProductCategoryTwoSchema),
        defaultValues: currentProductCategoryTwo,
    });

    const onSubmit = async (data: z.infer<typeof ProductCategoryTwoSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`productCategoryTwo/${productCategoryTwoID}`, data);
            toast.success(response.data.message);
            getProductCategoriesTwo(); // Refresh product categories after update
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
                    <DialogTitle>Update Product Category Two</DialogTitle>
                </DialogHeader>
                <ProductCategoryTwoDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isLoading} form="productCategoryTwoForm">
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

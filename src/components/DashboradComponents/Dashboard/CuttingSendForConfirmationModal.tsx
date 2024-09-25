import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { cuttingSendConfirmationSchema } from "@/form_schemas/dashboardSchema";
import {
    currentVariantId,
    cuttingSendConfirmationModal,
} from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
    getAllWorks: any;
    selectedSizes: {label: string , value:  string}[];
};

export default function CuttingSendForConfirmationModal({ getAllWorks, selectedSizes }: Props) {
    const [open, setOpen] = useRecoilState(cuttingSendConfirmationModal);
    const [isLoading, setIsLoading] = useState(false);
    const variantId = useRecoilValue(currentVariantId);
    const { t } = useTranslation();

    const [damagedItemPairs, setDamagedItemPairs] = useState<{ size: string; value: string }[]>([]);
    const [quantityInNumPairs, setQuantityInNumPairs] = useState<{ size: string; value: string }[]>([]);

    const form = useForm<z.infer<typeof cuttingSendConfirmationSchema>>({
        resolver: zodResolver(cuttingSendConfirmationSchema),
        defaultValues: {
            ClothCount: "",
            ClothLength: "",
            ClothWeight: "",
            ClothWidth: "",
            Notes: "",
            QuantityInKg: "",
            ReplacedItemInKG: "",
            DamagedItem: [],
            QuantityInNum: [],
        },
    });

    useEffect(() => {
        if (selectedSizes && selectedSizes.length > 0) {
            setDamagedItemPairs(selectedSizes.map(size => ({ size: size.label, value: size.value })));
            setQuantityInNumPairs(selectedSizes.map(size => ({ size: size.label, value: size.value })));
            
        }
    }, [selectedSizes]);

    const handleSubmit = async (data: z.infer<typeof cuttingSendConfirmationSchema>) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                DamagedItem: JSON.stringify(damagedItemPairs),
                QuantityInNum: JSON.stringify(quantityInNumPairs),
            };

            console.log("Payload:", payload);

            const newNote = await axios.post(
                `trackingmodels/sent/cutting/checking/variant/${variantId}`,
                payload,
                {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(newNote.data.message);
            form.reset();
            setDamagedItemPairs(selectedSizes.map(size => ({ size: size.label , value: size.value })));
            setQuantityInNumPairs(selectedSizes.map(size => ({ size: size.label , value: size.value })));
            getAllWorks();
            setIsLoading(false);
            setOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    const updatePair = (index: number, value: string, setPairs: React.Dispatch<React.SetStateAction<{ size: string; value: string }[]>>) => {
        setPairs((prev) => {
            const updatedPairs = [...prev];
            updatedPairs[index].value = value;
            return updatedPairs;
        });
    };

    const renderTable = (pairs: { size: string; value: string }[], setPairs: React.Dispatch<React.SetStateAction<{ size: string; value: string }[]>>, label: string) => (
        <div className="space-y-2">
            <label className="block font-medium text-sm">{label}</label>
            {pairs.map((pair, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input
                        type="text"
                        value={pair.size}
                        readOnly
                        className="w-full border p-1"
                        placeholder="Size"
                    />
                    <Input
                        type="text"
                        value={pair.value}
                        onChange={(e) => updatePair(index, e.target.value, setPairs)}
                        className="w-full border p-1"
                        placeholder="Value"
                    />
                </div>
            ))}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("CuttingConfirmation")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="grid grid-cols-1 gap-2"
                        id="sent-confirmation"
                    >
                        <FormField
                            control={form.control}
                            name="QuantityInKg"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder=""
                                    label={t("QuantityInKg")}
                                    field={field}
                                />
                            )}
                        />
                        {renderTable(quantityInNumPairs, setQuantityInNumPairs, t("QuantityInNumber"))}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="ClothCount"
                                render={({ field }) => (
                                    <TextInputFieldForForm
                                        placeholder=""
                                        label={t("ClothCount")}
                                        field={field}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ClothLength"
                                render={({ field }) => (
                                    <TextInputFieldForForm
                                        placeholder=""
                                        label={t("ClothLength")}
                                        field={field}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ClothWidth"
                                render={({ field }) => (
                                    <TextInputFieldForForm
                                        placeholder=""
                                        label={t("ClothWidth")}
                                        field={field}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ClothWeight"
                                render={({ field }) => (
                                    <TextInputFieldForForm
                                        placeholder=""
                                        label={t("ClothWeight")}
                                        field={field}
                                    />
                                )}
                            />
                        </div>
                        {renderTable(damagedItemPairs, setDamagedItemPairs, t("DamagedItem"))}
                        <FormField
                            control={form.control}
                            name="ReplacedItemInKG"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder=""
                                    label={t("ReplacedItemInKg")}
                                    field={field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Notes"
                            render={({ field }) => (
                                <TextInputFieldForForm
                                    placeholder=""
                                    label={t("Notes")}
                                    field={field}
                                />
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button type="submit" disabled={isLoading} form="sent-confirmation">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("PleaseWait")}
                            </>
                        ) : (
                            t("Send")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

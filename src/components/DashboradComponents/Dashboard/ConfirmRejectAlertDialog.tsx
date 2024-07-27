import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
    acceptVariant: any;
    rejectVariant: any;
    quantityReceivedFromPreviousDep: string;
};

export default function ConfirmRejectAlertDialog({
                                                     acceptVariant,
                                                     rejectVariant,
                                                     quantityReceivedFromPreviousDep,
                                                 }: Props) {
    const { t } = useTranslation();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>{t("Confirm")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("ConfirmVariant")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("WillYouConfirmQuantities")}
                        <div>{quantityReceivedFromPreviousDep}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-700 hover:bg-red-600"
                        onClick={() => rejectVariant()}
                    >
                        {t("No")}
                    </AlertDialogAction>
                    <AlertDialogAction onClick={() => acceptVariant()}>
                        {t("Yes")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

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
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
    triggerButton: React.ReactNode;
    onConfirm: () => void;
}

export default function ConfirmationDialog({
                                               triggerButton,
                                               onConfirm,
                                           }: ConfirmationDialogProps) {
    const { t } = useTranslation();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("ActionConfirmationTask")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("AreYouSureTask")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t("Confirm")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

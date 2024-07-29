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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";

interface Props {
    takeAction: (reason?: any) => void;
    btnText: string;
    varient?:
        | "secondary"
        | "default"
        | "ghost"
        | "destructive"
        | "link"
        | "outline";
    className?: string;
    showInput?: boolean;
}

export default function BasicConfirmationDialog({
                                                    takeAction,
                                                    btnText,
                                                    varient = "default",
                                                    className = "",
                                                    showInput = false,
                                                }: Props) {
    const { t } = useTranslation();
    const methods = useForm<{ reason?: string }>({
        defaultValues: {
            reason: "",
        },
    });

    const { handleSubmit, register, formState: { errors } } = methods;

    const onSubmit = (data: { reason?: string }) => {
        takeAction(data.reason);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={varient} className={className}>
                    {btnText}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("ActionConfirmation")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("AreYouSure")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {showInput ? (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} id="confirmation-form">
                            <div className="mb-4">
                                <TextInputFieldForForm
                                    label={t("Reason")}
                                    placeholder=""
                                    field={register("reason", { required: showInput })}
                                />
                                {errors.reason && <span className="error">{errors.reason.message}</span>}
                            </div>
                        </form>
                    </FormProvider>
                ) : null}
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={showInput ? handleSubmit(onSubmit) : () => takeAction()}>
                        {t("Confirm")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

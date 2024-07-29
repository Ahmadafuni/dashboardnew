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

interface Props {
  takeAction: any;
  btnText: string;
  varient?:
      | "secondary"
      | "default"
      | "ghost"
      | "destructive"
      | "link"
      | "outline";
  className: string;
}

export default function BasicConfirmationDialog({
                                                  takeAction,
                                                  btnText,
                                                  varient = "default",
                                                  className = "",
                                                }: Props) {
  const { t } = useTranslation();

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
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => takeAction()}>
              {t("Confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}

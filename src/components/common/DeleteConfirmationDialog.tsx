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
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  deleteRow: any;
}
export default function DeleteConfirmationDialog({ deleteRow }: Props) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DeleteConfirmationDialogTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteConfirmationDialogDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("DeleteConfirmationDialogCancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRow()}>
            {t("DeleteConfirmationDialogContinue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

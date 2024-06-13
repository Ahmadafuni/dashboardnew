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

type Props = {
  acceptVariant: any;
  rejectVariant: any;
};
export default function ConfirmRejectAlertDialog({
  acceptVariant,
  rejectVariant,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Confirm</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Variant?</AlertDialogTitle>
          <AlertDialogDescription>
            Will you confirm the variant?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 hover:bg-red-600"
            onClick={() => rejectVariant()}
          >
            No
          </AlertDialogAction>
          <AlertDialogAction onClick={() => acceptVariant()}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

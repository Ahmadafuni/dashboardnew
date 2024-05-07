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

interface Props {
  takeAction: any;
  btnText: string;
}
export default function BasicConfirmationDialog({
  takeAction,
  btnText,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>{btnText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Action Confirmation!</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to confirm this action!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => takeAction()}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

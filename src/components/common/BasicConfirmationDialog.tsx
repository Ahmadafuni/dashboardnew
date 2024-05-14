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
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={varient} className={className}>
          {btnText}
        </Button>
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

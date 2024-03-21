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
import ButtonTooltipStructure from "./ButtonTooltipStructure";

interface Props {
  deleteRow: any;
}
export default function DeleteConfirmationDialog({ deleteRow }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ButtonTooltipStructure description="Delete">
          <Button variant={"destructive"}>
            <Trash className="h-4 w-4" />
          </Button>
        </ButtonTooltipStructure>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete this?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRow()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downLoadFile } from "@/services/Commons.services";
import { checkSubmittedTaskModal, feedbackData } from "@/store/Tasks";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

export default function CheckSubmittedTask() {
  const { t } = useTranslation();
  const [open, setOpen] = useRecoilState(checkSubmittedTaskModal);
  const currentFeedback = useRecoilValue(feedbackData);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check Task</DialogTitle>
        </DialogHeader>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {currentFeedback.Feedback}
        </p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("Close")}
          </Button>
          <Button
            disabled={!currentFeedback.FeedbackFile}
            onClick={() =>
              downLoadFile(
                "https://dashboardbackendnew.onrender.com" +
                  currentFeedback.FeedbackFile
              )
            }
          >
            {t("Download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

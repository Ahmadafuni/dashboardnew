import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { noteSchema } from "@/form_schemas/newNoteSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {newNoteModal} from "@/store/Notes.ts";
import NoteForm from "@/components/DashboradComponents/Notes/NoteForm.tsx";

interface Props {
    getNotes: any;
}

export default function NewNote({ getNotes }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useRecoilState(newNoteModal);

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            NoteType: "",
            AssignedToDepartmentId: 0,
            AssignedToWarehouseId: 0,
            Description: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof noteSchema>) => {
        setIsLoading(true);
        try {
            const newNote = await axios.post("notes/", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newNote.data.message);
            getNotes();
            form.reset();
            setIsLoading(false);
            setOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("New Note")}</DialogTitle>
                </DialogHeader>
                <NoteForm form={form} onSubmit={handleSubmit} />
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                    <Button type="submit" disabled={isLoading} form="note">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("Please wait")}
                            </>
                        ) : (
                            t("Add")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

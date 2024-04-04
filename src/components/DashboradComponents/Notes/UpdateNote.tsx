import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";
import {noteData, noteId, updateNoteModal} from "@/store/Notes.ts";
import {noteSchema} from "@/form_schemas/newNoteSchema.ts";
import NoteForm from "@/components/DashboradComponents/Notes/NoteForm.tsx";

interface Props {
    getNotes: any;
}

export default function NoteUpdate({ getNotes }: Props) {
    const noteID = useRecoilValue(noteId);
    const [open, setOpen] = useRecoilState(updateNoteModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentNote = useRecoilValue(noteData);
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            NoteType: "",
            AssignedToDepartmentId: 0,
            AssignedToWarehouseId: 0,
            Description: "",
        },
        values: currentNote,
    });

    const handleSubmit = async (data: z.infer<typeof noteSchema>) => {
        setIsLoading(true);
        try {
            const updateNote = await axios.put(`notes/${noteID}`, data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(updateNote.data.message);
            getNotes();
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
                    <DialogTitle>{t("Update Note")}</DialogTitle>
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
                            t("Update")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

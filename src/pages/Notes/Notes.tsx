import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataTable from "@/components/common/DataTable.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { newNoteModal, updateNoteModal, noteId } from "@/store/Notes.ts";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog.tsx";
import {
    deleteNote,
    getAllNotes,
    getNoteById
} from "@/services/Notes.services.ts";
import NewNote from "@/components/DashboradComponents/Notes/NewNote.tsx";
import UpdateNote from "@/components/DashboradComponents/Notes/UpdateNote.tsx";
import {NoteType} from "@/types/Notes/Notes.types.ts";

export default function Notes() {
    const { t } = useTranslation();
    const [notes, setNotes] = useState<NoteType[]>([]);
    const setNewNoteModal = useSetRecoilState(newNoteModal);
    const setUpdateNoteModal = useSetRecoilState(updateNoteModal);
    const setNoteId = useSetRecoilState(noteId);

    const noteColumns: ColumnDef<NoteType>[] = [
        { accessorKey: "NoteType", header: t("NoteType"),},
        { accessorKey: "AssignedToDepartmentId", header: t("AssignedToDepartmentId"),},
        { accessorKey: "AssignedToWarehouseId", header: t("AssignedToWarehouseId"),},
        { accessorKey: "Description", header: t("Description"),},
        { header: t("Action"),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                setNoteId(row.original.Id);
                                getNoteById(setNotes, row.original.Id);
                                setUpdateNoteModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() => deleteNote(setNotes, row.original.Id)}
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllNotes(setNotes);
    }, []);

    return (
        <div className="w-full space-y-2">
            <NewNote getNotes={getAllNotes} />
            <UpdateNote getNotes={getAllNotes} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("Notes")}</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewNoteModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("AddNote")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={noteColumns} data={notes} />
                </div>
            </div>
        </div>
    );
}

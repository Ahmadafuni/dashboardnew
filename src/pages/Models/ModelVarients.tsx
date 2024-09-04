import NewModelVarientDialog from "@/components/DashboradComponents/Models/NewModelVarientDialog";
import UpdateModelVarientDialog from "@/components/DashboradComponents/Models/UpdateModelVarientDialog";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
    deleteModelVarient,
    getAllModelVarients,
    getModelVarientById, holdModelVarinte, restartModelVarinte,
} from "@/services/ModelVarients.services";
import {
    currentModelVarient,
    currentModelVarientId,
    newModelVarientModal,
    updateModelVarientModal,
} from "@/store/ModelVarients";
import {ModelVarientsTypes} from "@/types/Models/ModelVarients.types";
import {ColumnDef} from "@tanstack/react-table";
import {Pen, Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import BackButton from "@/components/common/BackButton.tsx";
import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog.tsx";

export default function ModelVarients() {
    const setNewModelVarientModal = useSetRecoilState(newModelVarientModal);
    const setUpdateModelVarientModal = useSetRecoilState(updateModelVarientModal);
    const {t} = useTranslation();
    // Navigate
    const navigate = useNavigate();
    const {id} = useParams();
    // Model Varients
    const [modelVarients, setModelVarients] = useState<ModelVarientsTypes[]>([]);
    const setCurrentVarient = useSetRecoilState(currentModelVarient);
    const setCurrentVarientId = useSetRecoilState(currentModelVarientId);

    // Columns
    const modelVarientsColumns: ColumnDef<ModelVarientsTypes>[] = [
        {
            accessorKey: "Model",
            header: t("ModelName"),
        },
        {
            accessorKey: "Color",
            header: t("Colors"),
        },
        {
            header: t("Sizes"),
            cell: ({row}) => {
                return (
                    <Button
                        onClick={() => {
                            navigate(
                                `/dashboard/templates/update/${row.original.TemplateId}`
                            );
                        }}
                    >
                        {row.original.Sizes.join(", ")}
                    </Button>
                );
            },
        },
        {
            accessorKey: "Quantity",
            header: t("Quantity"),
        },
        {
            header: t("QuantityDetails"),
            cell: ({row}) => {
                return <p>{+row.original.Quantity / row.original.Sizes.length}</p>;
            },
        },
        {
            accessorKey: "Status",
            cell: ({row}) => {
                return (
                    <div className="space-x-1">

                        {row.original.RunningStatus === "RUNNING" ? (
                            <BasicConfirmationDialog
                                btnText={t("Pause")}
                                takeAction={(reason: string) => holdModelVarinte(setModelVarients, row.original.Id, reason, id)}
                                className="bg-orange-500 hover:bg-orange-600"
                                showInput={true}
                            />
                        ) : (
                            <BasicConfirmationDialog
                                btnText={t("Restart")}
                                takeAction={() => restartModelVarinte(setModelVarients, row.original.Id, id)}
                                className="bg-green-500 hover:bg-green-600"
                            />
                        )
                        }
                    </div>
                )
            },
        },
        {
            header: t("Action"),
            cell: ({row}) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            onClick={() => {
                                getModelVarientById(setCurrentVarient, row.original.Id);
                                setCurrentVarientId(row.original.Id);
                                setUpdateModelVarientModal(true);
                            }}
                        >
                            <Pen className="h-4 w-4"/>
                        </Button>
                        <DeleteConfirmationDialog
                            deleteRow={() =>
                                deleteModelVarient(setModelVarients, row.original.Id, id)
                            }
                        />
                    </div>
                );
            },
        },
    ];

    // Page on load
    useEffect(() => {
        getAllModelVarients(setModelVarients, id);
    }, []);
    return (
        <div className="w-full space-y-2">
            <NewModelVarientDialog
                getAllVarients={() => getAllModelVarients(setModelVarients, id)}
                modelId={id}
            />
            <UpdateModelVarientDialog
                getAllVarients={() => getAllModelVarients(setModelVarients, id)}
                modelId={id}
            />
            <div className="w-full space-y-1">
                <div className="w-full space-y-1 flex items-center">
                    <BackButton/>
                    <h1 className="text-3xl font-bold w-full">{t("ModelDetails")}</h1>
                </div>
                <Separator/>
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setNewModelVarientModal(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        {t("Add")}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={modelVarientsColumns} data={modelVarients}/>
                </div>
            </div>
        </div>
    );
}

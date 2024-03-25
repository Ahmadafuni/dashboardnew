import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import DataTable from "@/components/common/DataTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {Plus, Pen, PencilRuler} from 'lucide-react';
import { deleteTemplateSize, getAllTemplateSizes } from '@/services/TemplateSizes.services';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import ButtonTooltipStructure from '@/components/common/ButtonTooltipStructure';
import {TemplateSizesType} from "@/types/Templates/TemplateSizes.types.ts";

export default function TemplateSizes() {
    const { t } = useTranslation();
    const { templateId } = useParams();
    const [templateSizes, setTemplateSizes] = useState<TemplateSizesType[]>([]);
    const navigate = useNavigate();

    const templateSizesColumns = [
        { header: t('TemplateId'), cell: ({ row }: any) => <p>{row.original.TemplateId}</p> },
        { header: t('SizeId'), cell: ({ row }: any) => <p>{row.original.SizeId}</p> },
        { header: t('TemplateSizeType'), cell: ({ row }: any) => <p>{row.original.TemplateSizeType}</p> },
        { header: t('Description'), cell: ({ row }: any) => <p>{row.original.Description}</p> },
        {
            header: t('Action'),
            cell: ({ row }: any) => (
                <div className="flex gap-1">
                    <ButtonTooltipStructure description={t('EditTemplateSize')}>
                        <Button
                            onClick={() => {
                                // Handle edit functionality
                            }}
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                    </ButtonTooltipStructure>
                    <ButtonTooltipStructure description={t('View Measurement')}>
                        <Button
                            onClick={() => {
                                // Handle to view  Measurement and edited
                            }}
                        >
                            <PencilRuler className="h-4 w-4" />
                        </Button>
                    </ButtonTooltipStructure>
                    <DeleteConfirmationDialog
                        deleteRow={() => deleteTemplateSize(setTemplateSizes, row.original.Id, templateId)}
                    />
                </div>
            ),
        },
    ];

    useEffect(() => {
        getAllTemplateSizes(setTemplateSizes, templateId);
    }, []);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t('TemplateSizes')}</h1>
                <Separator />
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                        <Button onClick={() => {navigate(`/dashboard/templates/templatesizes/new/${templateId}`)}}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('Add')}
                    </Button>
                </div>
                <div className="rounded-md border overflow-x-scroll">
                    <DataTable columns={templateSizesColumns} data={templateSizes} />
                </div>
            </div>
        </div>
    );
}

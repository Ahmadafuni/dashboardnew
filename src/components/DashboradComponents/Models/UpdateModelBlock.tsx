import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateModel from "@/components/DashboradComponents/Models/UpdateModel";
import { useTranslation } from "react-i18next";
import ViewManufacturingStageModel from "@/components/DashboradComponents/ManufacturingStageModel/ViewManufacturingStageModel.tsx";
import ModelVarients from "@/pages/Models/ModelVarients.tsx";

export default function UpdateModelBlock() {
    const { t } = useTranslation();

    return (
        <Tabs defaultValue="model" className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="model" className="cursor-default">
                    {t("Model")}
                </TabsTrigger>
                <TabsTrigger value="stages" className="cursor-default">
                    {t("Stages")}
                </TabsTrigger>
                <TabsTrigger value="details" className="cursor-default">
                    {t("Details")}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="model">
                <UpdateModel />
            </TabsContent>

            <TabsContent value="stages">
                <ViewManufacturingStageModel />
            </TabsContent>
            <TabsContent value="details">
                <ModelVarients />
            </TabsContent>
        </Tabs>
    );
}

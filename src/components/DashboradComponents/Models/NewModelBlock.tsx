import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewModelVarient from "./NewModelVarient";
import NewModel from "@/components/DashboradComponents/Models/NewModel.tsx";
import NewManufacturingStageModel from "@/components/DashboradComponents/ManufacturingStageModel/NewManufacturingStageModel.tsx";

export default function NewModelBlock() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(
        searchParams.get("tab") !== null ? searchParams.get("tab") : "model"
    );

    return (
        <Tabs value={currentTab} className="mt-2">
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
                <NewModel setNext={setCurrentTab} />
            </TabsContent>
            <TabsContent value="stages">
                <NewManufacturingStageModel setNext={setCurrentTab} /> {/* Pass setCurrentTab */}
            </TabsContent>
            <TabsContent value="details">
                <NewModelVarient />
            </TabsContent>
        </Tabs>
    );
}

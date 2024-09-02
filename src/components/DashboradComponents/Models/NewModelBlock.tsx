import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewModelVarient from "./NewModelVarient";
import NewManufacturingStages from "@/components/DashboradComponents/ManufacturingStages/NewManufacturingStages";
import NewModel from "@/components/DashboradComponents/Models/NewModel.tsx";

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
                <TabsTrigger value="details" className="cursor-default">
                    {t("Details")}
                </TabsTrigger>
                <TabsTrigger value="stages" className="cursor-default">
                    {t("Stages")}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="model">
                <NewModel setNext={setCurrentTab} />
            </TabsContent>
            <TabsContent value="details">
                <NewModelVarient setNext={() => setCurrentTab("stages")}/>
            </TabsContent>
            <TabsContent value="stages">
                <NewManufacturingStages />
            </TabsContent>
        </Tabs>
    );
}

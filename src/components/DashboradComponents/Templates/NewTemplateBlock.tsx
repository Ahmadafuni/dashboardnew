import NewManufacturingStages from "@/components/DashboradComponents/ManufacturingStages/NewManufacturingStages";
import NewTemplates from "@/components/DashboradComponents/Templates/NewTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import NewMeasurement from "../Measurements/NewMeasurement";
import { useTranslation } from "react-i18next";

export function NewTemplateBlock() {
    // @ts-expect-error
    let [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(
    searchParams.get("tab") !== null ? searchParams.get("tab") : "template");
    const { t } = useTranslation();

    return (
    // @ts-expect-error
    <Tabs value={currentTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="template" className="cursor-default">
            {t("Template")}
        </TabsTrigger>
        <TabsTrigger value="cutting" className="cursor-default">
            {t("Cutting")}
        </TabsTrigger>
        <TabsTrigger value="dressup" className="cursor-default">
            {t("Dressup")}
        </TabsTrigger>
        <TabsTrigger value="stages" className="cursor-default">
            {t("Stages")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="template">
        <NewTemplates setNext={setCurrentTab} />
      </TabsContent>
      <TabsContent value="cutting">
        <NewMeasurement
          sizeType="CUTTING"
          setNext={() => setCurrentTab("dressup")}
        />
      </TabsContent>
      <TabsContent value="dressup">
        <NewMeasurement
          sizeType="DRESSUP"
          setNext={() => setCurrentTab("stages")}
        />
      </TabsContent>
      <TabsContent value="stages">
        <NewManufacturingStages />
      </TabsContent>
    </Tabs>
  );
}

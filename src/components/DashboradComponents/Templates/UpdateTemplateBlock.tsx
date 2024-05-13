import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateTemplate from "./UpdateTemplate";
import MeasurementView from "../Measurements/MeasurementView";
import ViewManufacturingStages from "../ManufacturingStages/ViewManufacturingStages";
import {useTranslation} from "react-i18next";

export default function UpdateTemplateBlock() {
    const { t } = useTranslation();

    return (
    <Tabs defaultValue="template">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="template">{t("Template")}</TabsTrigger>
        <TabsTrigger value="cutting"> {t("Cutting")}</TabsTrigger>
        <TabsTrigger value="dressup">{t("Dressup")}</TabsTrigger>
        <TabsTrigger value="stages">{t("Stages")}</TabsTrigger>
      </TabsList>
      <TabsContent value="template">
        <UpdateTemplate />
      </TabsContent>
      <TabsContent value="cutting">
        <MeasurementView type="CUTTING" />
      </TabsContent>
      <TabsContent value="dressup">
        <MeasurementView type="DRESSUP" />
      </TabsContent>
      <TabsContent value="stages">
        <ViewManufacturingStages />
      </TabsContent>
    </Tabs>
  );
}

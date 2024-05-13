import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateTemplate from "./UpdateTemplate";
import MeasurementView from "../Measurements/MeasurementView";
import ViewManufacturingStages from "../ManufacturingStages/ViewManufacturingStages";

export default function UpdateTemplateBlock() {
  return (
    <Tabs defaultValue="template" className="mt-2">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="template">Template</TabsTrigger>
        <TabsTrigger value="cutting">Cutting</TabsTrigger>
        <TabsTrigger value="dressup">Dressup</TabsTrigger>
        <TabsTrigger value="stages">Stages</TabsTrigger>
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

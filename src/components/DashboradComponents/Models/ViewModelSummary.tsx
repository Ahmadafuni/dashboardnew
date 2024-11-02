import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getModelSummary } from "@/services/Model.services";
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {useTranslation} from "react-i18next";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { BASE_URL } from "@/config";

export default function ViewModelSummary() {
  const { id } = useParams();
  // Model summary
  const [summary, setSummary] = useState<any>({});
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
        content: () => printRef.current ?? null,
        documentTitle: `Model_Summary_${summary?.modelInfo?.Barcode}`
  });

  useEffect(() => {
    getModelSummary(setSummary, id);

  }, [summary]);


  interface Size {
    label: string;
    value: number | string;
  }
  
  interface TrakingModel {
    ClothWeight: string | null;
    ReplacedItemInKG: string | null;
    ClothCount: string | null;
    ClothLength:string | null ;
    ClothWidth: string | null ;
    DamagedItem: [] ;
    QuantityReceived: [] ;
    QuantityDelivered: [];
    StartTime: string;
    EndTime: string
  }
  
  interface Variant {
    Id: number;
    ColorName: string;
    Quantity: number;
    Sizes: Size[];
    TrakingModels: TrakingModel;
  }

  return (
    <div className="p-4" ref={printRef}>
      <div>
        <div className="border-2 grid grid-cols-4 text-right">
          <div className="border-2 p-2">{summary?.modelInfo?.OrderNumber}</div>
          <div className="border-2 p-2">{t("OrderNumber")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelDate}</div>
          <div className="border-2 p-2">{t("ModelCreatedDate")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Quantity}</div>
          <div className="border-2 p-2">{t("Quantity")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelNumber}</div>
          <div className="border-2 p-2">{t("ModelNumber")}</div>
          <div className="border-2 p-2">
            {summary?.modelInfo?.Specification}
          </div>
          <div className="border-2 p-2">{t("Characteristics")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelName}</div>
          <div className="border-2 p-2">{t("ModelName")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Barcode}</div>
          <div className="border-2 p-2">{t("Barcode")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Sizes?.map((e:any)=> e).join(" , ")}</div>
          <div className="border-2 p-2">{t("Sizes")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.LabelType}</div>
          <div className="border-2 p-2">{t("LabelType")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.FabricType}</div>
          <div className="border-2 p-2">{t("TextileType")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Template}</div>
          <div className="border-2 p-2">{t("Template")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Colors}</div>
          <div className="border-2 p-2">{t("Colors")}</div>
          <div className="border-2 p-2">
            {summary?.modelInfo?.PrintLocation}
          </div>
          <div className="border-2 p-2">{t("PrintLocation")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.DeliveryDate}</div>
          <div className="border-2 p-2">{t("DeadlineDate")}</div>
          <div className="border-2 p-2 col-span-3">
            {summary?.modelInfo?.Description}
          </div>
          <div className="border-2 p-2">{t("Description")}</div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {summary?.modelInfo?.Images != null && summary?.modelInfo?.Images.split(",").map((i: any) => (
          // <img key={i} src={`https://dashboardbackendnew.onrender.com${i}`} />
          <img key={i} src={`${BASE_URL}${i}`} />
        ))}
      </div>
      {summary?.stages?.length > 0 && (
  <div className="grid grid-cols-1 gap-2 mt-2">
    <Card>
      <CardHeader>
        <CardTitle>{t("Stages")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("StageNumber")}</TableHead>
              <TableHead>{t("DepartmentName")}</TableHead>
              <TableHead>{t("WorkDescription")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary?.stages.map((stage: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{stage.StageNumber}</TableCell>
                <TableCell>{stage.DepartmentName}</TableCell>
                <TableCell>{stage.WorkDescription}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)}


      {summary?.cutting?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cutting")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("MeasurementName")}</TableHead>
                    {Object.entries(summary?.cutting[0])
                      .sort()
                      // @ts-expect-error
                      .map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    summary?.cutting.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item)
                          .sort()
                          .map(([key, value]) =>
                            key !== "MeasurementName" &&
                            key !== "MeasurementUnit" ? (
                              // @ts-expect-error
                              <TableCell key={key}>{value}</TableCell>
                            ) : null
                          )}
                        <TableCell>{item.MeasurementUnit}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("Dressup")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {Object.entries(summary?.dressup[0])
                      .sort()
                      // @ts-expect-error
                      .map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    summary?.dressup.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item)
                          .sort()
                          .map(([key, value]) =>
                            key !== "MeasurementName" &&
                            key !== "MeasurementUnit" ? (
                              // @ts-expect-error
                              <TableCell key={key}>{value}</TableCell>
                            ) : null
                          )}
                        <TableCell>{item.MeasurementUnit}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

{/* <div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("بيانات المرسم")}</CardTitle>
    </CardHeader>
    <CardContent>

      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span>{t("DateReceived")}: 25/03/2023</span>
        <span>{t("DateDelivered")}: 26/03/2023</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("MarkerNumber")}</TableHead>
            <TableHead>{t("Dimensions")}</TableHead>
            <TableHead>{t("WastePercentage")}</TableHead>
            <TableHead>{t("Notes")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>54M-PL</TableCell>
            <TableCell>489*202</TableCell>
            <TableCell>%14</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div> */}


<div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("بيانات التفصيل")}</CardTitle>
    </CardHeader>
    <CardContent>

      {/* <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span>{t("تاريخ استلام الطلب")}: 26/03/2023</span>
        <span>{t("تاريخ تسليم القصّة")}: 28/03/2023</span>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("رقم الصبغة")}</TableHead>
            <TableHead>{t("اللون")}</TableHead>
            <TableHead>{t("عدد القطع")}</TableHead>
            <TableHead>{t("S")}</TableHead>
            <TableHead>{t("M")}</TableHead>
            <TableHead>{t("L")}</TableHead>
            <TableHead>{t("XL")}</TableHead>
            <TableHead>{t("XXL")}</TableHead>
            <TableHead>{t("الطول * العرض")}</TableHead>
            <TableHead>{t("عدد / الفجة")}</TableHead>
            <TableHead>{t("وزن / الفجة")}</TableHead>
            <TableHead>{t("التعويض")}</TableHead>
            <TableHead>{t("السقوط")}</TableHead>
            <TableHead>{t("تاريخ الاستلام")}</TableHead>
            <TableHead>{t("تاريخ التسليم")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        
        {
  summary?.modelVarients?.cuttingDepartment?.map((variant: Variant, index: number) => (
    <TableRow key={index}>
      
      <TableCell>{variant.Id}</TableCell>
      <TableCell>{variant.ColorName}</TableCell>
      <TableCell>{variant.Quantity}</TableCell>


      <TableCell>{variant.Sizes.find((size: Size) => size.label === "S")?.value || '-'}</TableCell>
      <TableCell>{variant.Sizes.find((size: Size) => size.label === "M")?.value || '-'}</TableCell>
      <TableCell>{variant.Sizes.find((size: Size) => size.label === "L")?.value || '-'}</TableCell>
      <TableCell>{variant.Sizes.find((size: Size) => size.label === "XL")?.value || '-'}</TableCell>
      <TableCell>{variant.Sizes.find((size: Size) => size.label === "XXL")?.value || '-'}</TableCell>

      <TableCell>{variant.TrakingModels?.ClothWidth} {variant.TrakingModels?.ClothWidth ? '*' : '-'} {variant.TrakingModels?.ClothLength}</TableCell>
      <TableCell>{variant.TrakingModels?.ClothCount || 'غير متوفر'}</TableCell>
      <TableCell>{variant.TrakingModels?.ClothWeight || 'غير متوفر'}</TableCell>
      <TableCell>{variant.TrakingModels?.ReplacedItemInKG || '-'}</TableCell>
      <TableCell>{variant.TrakingModels?.DamagedItem?.map((e:any) => e.label + ":" + (e.value? e.value : "0")).join(" , ") || 'غير متوفر'}</TableCell>
   
      <TableCell>{variant.TrakingModels?.StartTime}</TableCell>
      <TableCell>{variant.TrakingModels?.EndTime}</TableCell>

    </TableRow>
  ))
}

        </TableBody>
      </Table>
      
    </CardContent>
  </Card>
</div>



<div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("بيانات الطباعة")}</CardTitle>
    </CardHeader>
    <CardContent>

      {/* <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span>{t("تاريخ استلام الطلب")}: 26/03/2023</span>
        <span>{t("تاريخ تسليم الطباعة")}: 28/03/2023</span>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("رقم الصبغة")}</TableHead>
            <TableHead>{t("لون الصبغة")}</TableHead>
            <TableHead>{t("استلام: S")}</TableHead>
            <TableHead>{t("تسليم: S")}</TableHead>

            <TableHead>{t("استلام: M")}</TableHead>
            <TableHead>{t("تسليم: M")}</TableHead>

            <TableHead>{t("استلام: L")}</TableHead>
            <TableHead>{t("تسليم: L")}</TableHead>
            
            <TableHead>{t("استلام: XL")}</TableHead>
            <TableHead>{t("تسليم: XL")}</TableHead>

        
            <TableHead>{t("التعويض")}</TableHead>
            <TableHead>{t("السقط")}</TableHead>
            <TableHead>{t("تاريخ الاستلام")}</TableHead>
            <TableHead>{t("تاريخ التسليم")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {
            summary?.modelVarients?.printingDepartment?.map((variant: Variant, index: number) => (
              <TableRow key={index}>
                <TableCell>{variant.Id}</TableCell>
                <TableCell>{variant.ColorName}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived || '-'}</TableCell>
                
                <TableCell>{variant.TrakingModels.QuantityDelivered || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived || '-'}</TableCell>


                <TableCell>{variant.TrakingModels.ReplacedItemInKG || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.DamagedItem || '-'}</TableCell>
                <TableCell>{variant.TrakingModels?.StartTime}</TableCell>
                 <TableCell>{variant.TrakingModels?.EndTime}</TableCell>
              </TableRow>
            ))
          }
        

        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>


<div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("بيانات الخياطة")}</CardTitle>
    </CardHeader>
    <CardContent>

      {/* <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span>{t("تاريخ استلام الطلب")}: 26/03/2023</span>
        <span>{t("تاريخ تسليم الموديل")}: 28/03/2023</span>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("رقم الصبغة")}</TableHead>
            <TableHead>{t("لون الصبغة")}</TableHead>
            <TableHead>{t("استلام: S")}</TableHead>
            <TableHead>{t("تسليم: S")}</TableHead>

            <TableHead>{t("استلام: M")}</TableHead>
            <TableHead>{t("تسليم: M")}</TableHead>

            <TableHead>{t("استلام: L")}</TableHead>
            <TableHead>{t("تسليم: L")}</TableHead>
            
            <TableHead>{t("استلام: XL")}</TableHead>
            <TableHead>{t("تسليم: XL")}</TableHead>

        
            <TableHead>{t("التعويض")}</TableHead>
            <TableHead>{t("السقط")}</TableHead>
            <TableHead>{t("تاريخ الاستلام")}</TableHead>
            <TableHead>{t("تاريخ التسليم")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

        {
            summary?.modelVarients?.sewingDepartment?.map((variant: Variant, index: number) => (
              <TableRow key={index}>
                <TableCell>{variant.Id}</TableCell>
                <TableCell>{variant.ColorName}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                
                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>


                <TableCell>{variant.TrakingModels.ReplacedItemInKG || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.DamagedItem?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
             
                <TableCell>{variant.TrakingModels?.StartTime}</TableCell>
                <TableCell>{variant.TrakingModels?.EndTime}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>


<div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("بيانات الأمبلاج")}</CardTitle>
    </CardHeader>
    <CardContent>

      {/* <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span>{t("تاريخ استلام الطلب")}: 26/03/2023</span>
        <span>{t("تاريخ تسليم الموديل")}: 28/03/2023</span>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("رقم الصبغة")}</TableHead>
            <TableHead>{t("لون الصبغة")}</TableHead>
            <TableHead>{t("استلام: S")}</TableHead>
            <TableHead>{t("تسليم: S")}</TableHead>

            <TableHead>{t("استلام: M")}</TableHead>
            <TableHead>{t("تسليم: M")}</TableHead>

            <TableHead>{t("استلام: L")}</TableHead>
            <TableHead>{t("تسليم: L")}</TableHead>
            
            <TableHead>{t("استلام: XL")}</TableHead>
            <TableHead>{t("تسليم: XL")}</TableHead>
            <TableHead>{t("تاريخ الاستلام")}</TableHead>
            <TableHead>{t("تاريخ التسليم")}</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>

        {
            summary?.modelVarients?.emballageDepartment?.map((variant: Variant, index: number) => (
              <TableRow key={index}>
                <TableCell>{variant.Id}</TableCell>
                <TableCell>{variant.ColorName}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>

                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                
                <TableCell>{variant.TrakingModels.QuantityDelivered?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>
                <TableCell>{variant.TrakingModels.QuantityReceived?.map((e:any)=> e.label + ":" + e.value).join(" , ") || '-'}</TableCell>

                <TableCell>{variant.TrakingModels?.StartTime}</TableCell>
                <TableCell>{variant.TrakingModels?.EndTime}</TableCell>

              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>   


{/* <div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("النتائج النهائية")}</CardTitle>
    </CardHeader>
    <CardContent>


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("القياس/ اللون")}</TableHead>
            
            <TableHead>{t("بيج")}</TableHead>
            <TableHead>{t("أخضر")}</TableHead>

            <TableHead>{t("سقط تفصيل")}</TableHead>
            <TableHead>{t("سقط خياطة")}</TableHead>
            <TableHead>{t("سقط طباعة")}</TableHead>
            <TableHead>{t("سقط أمبلاج")}</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
            <TableCell>2845</TableCell>
            <TableCell>12</TableCell>
           
          </TableRow>

        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>  */}



{/* <div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("التقييم التقني")}</CardTitle>
    </CardHeader>
    <CardContent>


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("القياسات")}</TableHead>
            
            <TableHead>{t("الطباعة")}</TableHead>
            <TableHead>{t("الجودة")}</TableHead>

            <TableHead>{t("المشاكل الفنية")}</TableHead>
            <TableHead>{t("المشاكل التقنية")}</TableHead>
       

          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
           
          </TableRow>

        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div> */}


 {/* <div className="grid grid-cols-1 gap-2 mt-2">
  <Card>
    <CardHeader>
      <CardTitle>{t("التقييم الإداري")}</CardTitle>
    </CardHeader>
    <CardContent>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("سرعة التنفيذ")}</TableHead>
            
            <TableHead>{t("جودة المنتج")}</TableHead>
            <TableHead>{t("جودة الطباعة")}</TableHead>

            <TableHead>{t("تلبيس القالب")}</TableHead>

            <TableHead>{t("مطابقة الطلب")}</TableHead>

            <TableHead>{t("الملاءمة المالية")}</TableHead>

            <TableHead>{t("ملاحظات")}</TableHead>

        
          </TableRow>
        </TableHeader>
        <TableBody>

          <TableRow>
           
          </TableRow>

        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>  */}

      <div className="flex justify-end mt-4 print:hidden">
          <Button onClick={handlePrint}>{t("DownloadPDF")}</Button>
      </div>
    </div>
  );
}

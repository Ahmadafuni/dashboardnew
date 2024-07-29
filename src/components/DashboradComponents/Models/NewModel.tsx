import ModelForm from "@/components/DashboradComponents/Models/ModelForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {useRecoilState, useSetRecoilState} from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { ModelSchema } from "@/form_schemas/newModelSchema.ts";
import { templateList } from "@/store/Template";
import { textileList } from "@/store/Textiles";
import { colorList } from "@/store/Color";
import { productCategoryOneList } from "@/store/ProductCategoryOne";
import { productCategoryTwoList } from "@/store/ProductCategoryTwo";
import { productCatalogueList } from "@/store/ProductCatalogue";
import { getAllProductCataloguesList } from "@/services/ProductCatalogues.services";
import { getAllProductCategoryOneList } from "@/services/ProductCategoryOne.services";
import { getAllProductCategoryTwoList } from "@/services/ProductCategoryTwo.services";
import { getAllTextilesList } from "@/services/Textiles.services";
import { getAllColorsList } from "@/services/Colors.services";
import NewProductCategoryOne from "../Entities/ProductCategoryOne/NewProductCategoryOne";
import NewProductCategoryTwo from "../Entities/ProductCategoryTwo/NewProductCategoryTwo";
import { getAllTemplatesList } from "@/services/Templates.services";
import NewTextiles from "../Entities/Textiles/NewTextiles";
import NewProductCatalogueDialog from "../ProductCatalogue/NewProductCatalogueDialog";
import NewColor from "../Entities/Colors/NewColor";
import { useNavigate, useParams } from "react-router-dom";
import NewModelVarient from "./NewModelVarient";
import { modelVarientNew } from "@/store/Models";
import BackButton from "@/components/common/BackButton";

export default function NewModel() {
  // Translation
  const { t } = useTranslation();
  const { id } = useParams();
  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Navigate
  const navigate = useNavigate();

  // Varients
  const [varients, setVarients] = useRecoilState(modelVarientNew);

  // Recoil state
  const setTemplates = useSetRecoilState(templateList);
  const setTextile = useSetRecoilState(textileList);
  const setColor = useSetRecoilState(colorList);
  const setCategoryOne = useSetRecoilState(productCategoryOneList);
  const setCategoryTwo = useSetRecoilState(productCategoryTwoList);
  const setProductCatalogue = useSetRecoilState(productCatalogueList);

  // Files
  const [files, setFiles] = useState({});
  const handleFileChange = (e: any) => {
    setFiles(e.target.files);
  };

  // Form fields
  const form = useForm<z.infer<typeof ModelSchema>>({
    resolver: zodResolver(ModelSchema),
    defaultValues: {
      ProductCatalog: "",
      CategoryOne: "",
      CategoryTwo: "",
      Textile: "",
      Template: "",
      Characteristics: "",
      Barcode: "",
      LabelType: "",
      PrintName: "",
      PrintLocation: "",
      Description: "",
      DemoModelNumber: "",
    },
  });

  // Form submit function
  const onSubmit = async (data: z.infer<typeof ModelSchema>) => {
    if (varients.length <= 0) {
      toast.error("Please add varients first!");
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (Object.keys(files).length > 0) {
        for (let i = 0; i < Object.keys(files).length; i++) {
          // @ts-expect-error
          formData.append("models", files[i]);
        }
      }

      formData.append("DemoModelNumber", data.DemoModelNumber);
      formData.append("ProductCatalog", data.ProductCatalog);
      formData.append("CategoryOne", data.CategoryOne);
      formData.append("CategoryTwo", data.CategoryTwo);
      formData.append("Textile", data.Textile);
      formData.append("Template", data.Template);
      formData.append("Characteristics", data.Characteristics);
      formData.append("Barcode", data.Barcode);
      formData.append("LabelType", data.LabelType);
      formData.append("PrintName", data.PrintName);
      formData.append("PrintLocation", data.PrintLocation);
      formData.append("Description", data.Description);
      formData.append("Varients", JSON.stringify(varients));

      const newModel = await axios.post(`model/${id}`, formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newModel.data.message);
      setIsLoading(false);
      setVarients([]);
      navigate(`/dashboard/orders/model/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    setVarients([]);
    getAllProductCataloguesList(setProductCatalogue);
    getAllProductCategoryOneList(setCategoryOne);
    getAllProductCategoryTwoList(setCategoryTwo);
    getAllTextilesList(setTextile);
    getAllColorsList(setColor);
    getAllTemplatesList(setTemplates);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewProductCategoryOne
        getProductCategoriesOne={() =>
          getAllProductCategoryOneList(setCategoryOne)
        }
      />
      <NewProductCategoryTwo
        getProductCategoriesTwo={() =>
          getAllProductCategoryTwoList(setCategoryTwo)
        }
      />
      <NewTextiles getTextiles={() => getAllTextilesList(setTextile)} />
      <NewProductCatalogueDialog
        getCatalogues={() => getAllProductCataloguesList(setProductCatalogue)}
      />
      <NewColor getColors={() => getAllColorsList(setColor)} />
      <div className="w-full space-y-1 flex items-center">
        <BackButton />
        <h1 className="text-3xl font-bold">{t("NewModel")}</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <ModelForm
          form={form}
          onSubmit={onSubmit}
          handleFileChange={handleFileChange}
        />
      </div>
      <h2>23442</h2>
      <NewModelVarient />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} form="model">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("Please wait")}
            </>
          ) : (
            t("Add")
          )}
        </Button>
      </div>
    </div>
  );
}

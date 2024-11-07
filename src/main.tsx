import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";
import { Toaster } from "sonner";
import Cookies from "js-cookie";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import arTranslations from "./locales/ar.json";

// Theme and Layout
import { ThemeProvider } from "./components/theme-provider.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
// Pages
import Login from "./pages/Login/Login.tsx";
import Users from "./pages/Users/Users.tsx";
import ProductCatalogues from "@/pages/ProductCatalogues/ProductCatalogues.tsx";
import Statistics from "@/pages/Statistics/Statistics.tsx";
import Templates from "@/pages/Templates/Templates.tsx";
import Orders from "@/pages/Orders/Orders.tsx";
import Models from "@/pages/Models/Models.tsx";
import Tasks from "@/pages/Tasks/Tasks.tsx";
import Notes from "@/pages/Notes/Notes.tsx";
import Home from "@/pages/Home/Home.tsx";
import Warehouses from "@/pages/Warehouse/Warehouses.tsx";
import NewUsers from "@/components/DashboradComponents/Users/NewUsers.tsx";
import UpdateUser from "@/components/DashboradComponents/Users/UpdateUser.tsx";
import NewDepartment from "./components/DashboradComponents/Departments/NewDepartment.tsx";
import UpdateDepartment from "./components/DashboradComponents/Departments/UpdateDepartment.tsx";
import Departments from "./pages/Departments/Departments.tsx";
import Colors from "@/pages/Entities/Colors.tsx";
import Sizes from "@/pages/Entities/Sizes.tsx";
import Textiles from "@/pages/Entities/Textiles.tsx";
import TemplateType from "@/pages/Entities/TemplateType.tsx";
import TemplatePattern from "@/pages/Entities/TemplatePattern.tsx";
import ProductCategoryOne from "@/pages/Entities/ProductCategoryOne.tsx";
import ProductCategoryTwo from "@/pages/Entities/ProductCategoryTwo.tsx";
import NewProductCatalogueDetail from "./components/DashboradComponents/ProductCatalogueDetails/NewProductCatalogueDetail.tsx";
import UpdateProductCatalogueDetail from "./components/DashboradComponents/ProductCatalogueDetails/UpdateProductCatalogueDetail.tsx";
import ProductCatalogueDetails from "./pages/ProductCatalogueDetails/ProductCatalogueDetails.tsx";
import { NewTemplateBlock } from "./components/DashboradComponents/Templates/NewTemplateBlock.tsx";
import UpdateTemplateBlock from "./components/DashboradComponents/Templates/UpdateTemplateBlock.tsx";
import Collections from "@/pages/Entities/Collections.tsx";
import Suppliers from "@/pages/Warehouse/Suppliers.tsx";
import MaterialCategories from "@/pages/Warehouse/MaterialCategory.tsx";
import Materials from "@/pages/Warehouse/Materials.tsx";
import NewMaterial from "@/components/DashboradComponents/Warehouse/Materials/NewMaterial.tsx";
import UpdateMaterial from "@/components/DashboradComponents/Warehouse/Materials/UpdateMaterial.tsx";
import TemplateViewDetails from "@/components/DashboradComponents/Templates/TemplateViewDetails.tsx";
import ModelVarients from "./pages/Models/ModelVarients.tsx";
import ViewModelSummary from "./components/DashboradComponents/Models/ViewModelSummary.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import ChildMaterials from "@/pages/Warehouse/ChildMaterials.tsx";
import IncomingMovement from "@/pages/Warehouse/IncomingMovement.tsx";
import OutgoingMovement from "@/pages/Warehouse/OutgoingMovement.tsx";
import MaterialReport from "@/pages/Warehouse/MaterialReport.tsx";
import NewModelBlock from "@/components/DashboradComponents/Models/NewModelBlock.tsx";
import UpdateModelBlock from "@/components/DashboradComponents/Models/UpdateModelBlock.tsx";
import { BASE_URL } from "@/config/index.ts";
import ProductionReports from "./pages/Reports/ProductionReports.tsx";
import OrderReports from "./pages/Reports/OrderReports.tsx";
import ViewModelDetails from "./components/DashboradComponents/Models/ViewModelDetails.tsx";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common = {
  Authorization: `bearer ${Cookies.get("access_token")}`,
};

// Multilanguage
i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind i18n to React
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ar: {
        translation: arTranslations,
      },
    },
    lng: localStorage.getItem("currentLanguage") || "ar", // Load language preference from localStorage if available
    fallbackLng: "en", // Fallback to English if user's language is not available
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Routes
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      { path: "/dashboard/dashboard", element: <Dashboard /> },
      { path: "/dashboard/users", element: <Users /> },
      { path: "/dashboard/users/new", element: <NewUsers /> },
      { path: "/dashboard/users/:userID", element: <UpdateUser /> },

      { path: "/dashboard/departments", element: <Departments /> },
      { path: "/dashboard/departments/new", element: <NewDepartment /> },
      {
        path: "/dashboard/departments/:departmentID",
        element: <UpdateDepartment />,
      },

      { path: "/dashboard/home", element: <Home /> },
      { path: "/dashboard/productionreports", element: <ProductionReports /> },
      { path: "/dashboard/orderreports", element: <OrderReports /> },
      { path: "/dashboard/statistics", element: <Statistics /> },

      { path: "/dashboard/productcatalogues", element: <ProductCatalogues /> },
      {
        path: "/dashboard/productcatalogues/cataloguedetails/:catalogueId",
        element: <ProductCatalogueDetails />,
      },
      {
        path: "/dashboard/productcatalogues/cataloguedetails/new/:catalogueId",
        element: <NewProductCatalogueDetail />,
      },
      {
        path: "/dashboard/productcatalogues/cataloguedetails/update/:detailId",
        element: <UpdateProductCatalogueDetail />,
      },
      { path: "/dashboard/templates", element: <Templates /> },
      { path: "/dashboard/templates/new", element: <NewTemplateBlock /> },
      {
        path: "/dashboard/templates/update/:templateId",
        element: <UpdateTemplateBlock />,
      },
      { path: "/dashboard/orders", element: <Orders /> },
      { path: "/dashboard/orders/model/:id", element: <Models /> },
      {
        path: "/dashboard/orders/model/varients/:id",
        element: <ModelVarients />,
      },
      {
        path: "/dashboard/orders/model/update/:orderId/:id/",
        element: <UpdateModelBlock />,
      },
      { path: "/dashboard/orders/model/new/:id", element: <NewModelBlock /> },
      { path: "/dashboard/tasks", element: <Tasks /> },
      { path: "/dashboard/notes", element: <Notes /> },
      { path: "/dashboard/users", element: <Users /> },
      { path: "/dashboard/warehouses", element: <Warehouses /> },
      { path: "/dashboard/suppliers", element: <Suppliers /> },
      { path: "/dashboard/materialcategory", element: <MaterialCategories /> },
      { path: "/dashboard/materials", element: <Materials /> },
      { path: "/dashboard/materials/new", element: <NewMaterial /> },
      { path: "/dashboard/materials/:materialID", element: <UpdateMaterial /> },
      {
        path: "/dashboard/materials/child/:materialID",
        element: <ChildMaterials />,
      },
      { path: "/dashboard/incoming", element: <IncomingMovement /> },
      { path: "/dashboard/outgoing", element: <OutgoingMovement /> },
      { path: "/dashboard/materialreport", element: <MaterialReport /> },

      { path: "/dashboard/entities/collections", element: <Collections /> },
      { path: "/dashboard/entities/colors", element: <Colors /> },
      { path: "/dashboard/entities/sizes", element: <Sizes /> },
      { path: "/dashboard/entities/textiles", element: <Textiles /> },
      { path: "/dashboard/entities/templatetype", element: <TemplateType /> },

      {
        path: "/dashboard/entities/templatepattern",
        element: <TemplatePattern />,
      },
      {
        path: "/dashboard/entities/productcategoryone",
        element: <ProductCategoryOne />,
      },
      {
        path: "/dashboard/entities/productcategorytwo",
        element: <ProductCategoryTwo />,
      },
    ],
  },
  { path: "/templates/viewdetails/:id", element: <TemplateViewDetails /> },
  { path: "/models/viewdetails/:id", element: <ViewModelDetails /> },
  { path: "/models/viewsummary/:id", element: <ViewModelSummary /> },
]);

const App = () => {
  const [direction, setDirection] = useState(
    i18n.language === "ar" ? "rtl" : "ltr"
  );

  useEffect(() => {
    const updateDirection = (lang: any) => {
      setDirection(lang === "ar" ? "rtl" : "ltr");
    };

    i18n.on("languageChanged", updateDirection);

    return () => {
      i18n.off("languageChanged", updateDirection);
    };
  }, []);

  return (
    <div id="root" dir={direction}>
      <RecoilRoot>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster richColors />
        </ThemeProvider>
      </RecoilRoot>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

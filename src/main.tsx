import React from "react";
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
import Reports from "@/pages/Reports/Reports.tsx";
import ProductCatalogues from "@/pages/ProductCatalogues/ProductCatalogues.tsx";
import Statistics from "@/pages/Statistics/Statistics.tsx";
import Templates from "@/pages/Templates/Templates.tsx";
import Orders from "@/pages/Orders/Orders.tsx";
import Models from "@/pages/Models/Models.tsx";
import Tasks from "@/pages/Tasks/Tasks.tsx";
import Notes from "@/pages/Notes/Notes.tsx";
import Home from "@/pages/Home/Home.tsx";
import Stores from "@/pages/Stores/Stores.tsx";
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

// Axios config
// axios.defaults.baseURL = "http://localhost:3002/";
axios.defaults.baseURL = "https://dashboardbackendnew.onrender.com/";
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
      // { path: "/dashboard/test", element: <Test /> },
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
      { path: "/dashboard/reports", element: <Reports /> },
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
      { path: "/dashboard/models", element: <Models /> },
      { path: "/dashboard/tasks", element: <Tasks /> },
      { path: "/dashboard/notes", element: <Notes /> },
      { path: "/dashboard/users", element: <Users /> },
      { path: "/dashboard/stores", element: <Stores /> },

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);

//https://react-material.fusetheme.com/dashboards/project

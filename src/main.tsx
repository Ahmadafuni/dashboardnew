import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";
import { Toaster } from "sonner";
import Cookies from "js-cookie";
// Theme and Layout
import { ThemeProvider } from "./components/theme-provider.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
// Pages
import Login from "./pages/Login/Login.tsx";
import Users from "./pages/Users/Users.tsx";
import Departments from "@/pages/Departmnets/Departments.tsx";
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
import NewUsers from "@/pages/Users/NewUsers.tsx";
import UpdateUser from "@/pages/Users/UpdateUser.tsx";
import Colors from "@/pages/Entities/Colors/Colors.tsx";
import Sizes from "@/pages/Entities/Sizes/Sizes.tsx";
import ProductCategory1 from "@/pages/Entities/ProductCategory1/ProductCategory1.tsx";
import ProductCategory2 from "@/pages/Entities/ProductCategory2/ProductCategory2.tsx";
import TemplatePatterns from "@/pages/Entities/TemplatePatterns/TemplatePatterns.tsx";
import TemplateTypes from "@/pages/Entities/TemplateTypes/TemplateTypes.tsx";
import ColorDialog from "@/pages/Entities/Colors/ColorDialog.tsx";

// Routes
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      { path: "/dashboard/users", element: <Users /> },
      { path: "/dashboard/users/new", element: <NewUsers /> },
      { path: "/dashboard/users/:userID", element: <UpdateUser /> },


      { path: "/dashboard/home", element: <Home /> },
      { path: "/dashboard/reports", element: <Reports /> },
      { path: "/dashboard/statistics", element: <Statistics /> },
      { path: "/dashboard/productcatalogues", element: <ProductCatalogues /> },
      { path: "/dashboard/templates", element: <Templates /> },
      { path: "/dashboard/orders", element: <Orders /> },
      { path: "/dashboard/models", element: <Models /> },
      { path: "/dashboard/tasks", element: <Tasks /> },
      { path: "/dashboard/notes", element: <Notes /> },
      { path: "/dashboard/departments", element: <Departments /> },
      { path: "/dashboard/stores", element: <Stores /> },

      { path: "/dashboard/entities/colors", element: <Colors /> },
      { path: "/dashboard/entities/colors/new", element: <ColorDialog /> },
      { path: "/dashboard/entities/colors/:colorID", element: <Colors /> },

      { path: "/dashboard/entities/sizes", element: <Sizes /> },
      { path: "/dashboard/entities/productcategory1", element: <ProductCategory1 /> },
      { path: "/dashboard/entities/productcategory2", element: <ProductCategory2 /> },
      { path: "/dashboard/entities/templatepatterns", element: <TemplatePatterns /> },
      { path: "/dashboard/entities/templatetypes", element: <TemplateTypes /> },

    ],
  },
]);

// Axios config
axios.defaults.baseURL = "https://dashboardbackendnew.onrender.com/";
axios.defaults.headers.common = {
  authorization: `bearer ${Cookies.get("access_token")}`,
};

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

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
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

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
        { path: "/dashboard/home", element: <Home /> },
        { path: "/dashboard/reports", element: <Reports /> },
        { path: "/dashboard/statistics", element: <Statistics /> },
        { path: "/dashboard/productcatalogues", element: <ProductCatalogues /> },
        { path: "/dashboard/templates", element: <Templates /> },
        { path: "/dashboard/orders", element: <Orders /> },
        { path: "/dashboard/models", element: <Models /> },
        { path: "/dashboard/tasks", element: <Tasks /> },
        { path: "/dashboard/notes", element: <Notes /> },
        { path: "/dashboard/users", element: <Users /> },
        { path: "/dashboard/departments", element: <Departments /> },
        { path: "/dashboard/stores", element: <Stores /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

//https://react-material.fusetheme.com/dashboards/project

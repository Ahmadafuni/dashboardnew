import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";
// Theme and Layout
import { ThemeProvider } from "./components/theme-provider.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
// Pages
import Login from "./pages/Login/Login.tsx";
import Users from "./pages/Users/Users.tsx";
import { Toaster } from "sonner";
import Cookies from "js-cookie";

// Routes
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [{ path: "/dashboard/users", element: <Users /> }],
  },
]);

// Axios config
axios.defaults.baseURL = "https://factorybackend.onrender.com/";
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

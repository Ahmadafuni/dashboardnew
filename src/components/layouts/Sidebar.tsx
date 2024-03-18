import React from "react";
import {
  LayoutDashboard,
  Home,
  SquareScissors,
  FolderOpen,
  Shirt,
  ListOrdered,
  ListChecks,
  NotebookPen,
  UsersRound,
  LayoutPanelTop,
  FileBarChart2,
  Store,
  AlignJustify,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menus = [
    {
      gName: "System",
      childs: [
        { name: t("Home"), link: "/dashboard/home", icon: Home },
        { name: t("Reports"), link: "/dashboard/reports", icon: LayoutDashboard },
        { name: t("Statistics"), link: "/dashboard/statistics", icon: FileBarChart2 },
        { name: t("ProductCatalogues"), link: "/dashboard/productcatalogues", icon: FolderOpen },
        { name: t("Templates"), link: "/dashboard/templates", icon: SquareScissors },
        { name: t("Orders"), link: "/dashboard/orders", icon: ListOrdered },
        { name: t("Models"), link: "/dashboard/models", icon: Shirt },
        { name: t("Tasks"), link: "/dashboard/tasks", icon: ListChecks },
        { name: t("Notes"), link: "/dashboard/notes", icon: NotebookPen },
      ],
    },
    {
      gName: "Manager",
      childs: [
        { name: t("Home"), link: "/dashboard/home", icon: Home },
        { name: t("Reports"), link: "/dashboard/reports", icon: LayoutDashboard },
        { name: t("Statistics"), link: "/dashboard/statistics", icon: FileBarChart2 },
        { name: t("Users"), link: "/dashboard/users", icon: UsersRound },
        { name: t("Departments"), link: "/dashboard/departments", icon: LayoutPanelTop },
        { name: t("Stores"), link: "/dashboard/stores", icon: Store },
        { name: t("Tasks"), link: "/dashboard/tasks", icon: ListChecks },
        { name: t("Notes"), link: "/dashboard/notes", icon: NotebookPen },
      ],
    },
  ];

  return (
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <AlignJustify /> : undefined}
              style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "15px" }}>
                  <span>Department Name</span>
                  <Button onClick={() => setIsCollapsed(!isCollapsed)}>
                    <AlignJustify />
                  </Button>
                </div>
            )}
          </MenuItem>
          {menus.map((menu, index) => (
              <MenuItem key={index}>
                <h5 style={{ marginBottom: "10px", display: "block" }}>{menu.gName}</h5>
                {menu.childs.map((child, idx) => (
                    <NavLink key={idx} to={child.link} className="menu-item" style={{ marginBottom: "10px", display: "block" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <child.icon />
                        {!isCollapsed && <span style={{ marginLeft: "10px" }}>{child.name}</span>}
                      </div>
                    </NavLink>
                ))}
              </MenuItem>
          ))}
        </Menu>
      </ProSidebar>
  );
}

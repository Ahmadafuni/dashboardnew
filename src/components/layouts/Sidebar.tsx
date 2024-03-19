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
  AlignJustify, Palette, Ruler, SwatchBook, SquareAsterisk, Asterisk,
  ArrowUpDown, ArrowLeftRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { useState } from "react";

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
    {
      gName: "Business Entities",
      childs: [
        { name: t("Colors"), link: "/dashboard/entities/colors", icon: Palette },
        { name: t("Sizes"), link: "/dashboard/entities/sizes", icon: Ruler },
        { name: t("Textiles"), link: "/dashboard/entities/textiles", icon: SwatchBook },
        { name: t("TemplateType"), link: "/dashboard/entities/templatetype", icon: Asterisk },
        { name: t("TemplatePattern"), link: "/dashboard/entities/templatepattern", icon: SquareAsterisk },
        { name: t("ProductCategoryOne"), link: "/dashboard/entities/productcategoryone", icon: ArrowUpDown },
        { name: t("ProductCategoryTwo"), link: "/dashboard/entities/productcategorytwo", icon: ArrowLeftRight },
      ],
    },
  ];

  return (
      <div className="p-2 border-r-2" >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <AlignJustify /> : undefined}
              style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "0px"}}>
                  <span style={{ marginRight: "10px"}}>Department Name</span>
                    <AlignJustify onClick={() => setIsCollapsed(!isCollapsed)}/>
                </div>
            )}
          </MenuItem>
          {menus.map((menu, index) => (
              <MenuItem key={index}>
                <h5 style={{ marginBottom: "10px", display: "block" }}>{menu.gName}</h5>
                {menu.childs.map((child, idx) => (
                    <NavLink key={idx} to={child.link}
                             className={({ isActive }) => {
                               return isActive
                                   ? "flex items-center text-primary bg-primary-foreground text-sm px-2 py-[6px] rounded-sm cursor-pointer"
                                   : "flex items-center hover:text-primary hover:bg-primary-foreground text-sm px-2 py-[6px] rounded-sm cursor-pointer"}}
                    >
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
      </div>
  );
}

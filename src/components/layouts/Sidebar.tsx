import {
  LayoutDashboard,
  Home,
  SquareScissors,
  FolderOpen,
  ListOrdered,
  ListChecks,
  NotebookPen,
  UsersRound,
  LayoutPanelTop,
  FileBarChart2,
  AlignJustify,
  Palette,
  Ruler,
  SwatchBook,
  SquareAsterisk,
  Asterisk,
  ArrowUpDown,
  ArrowLeftRight,
  Boxes,
  Warehouse,
  Container,
  SquareStack,
  Shell,
} from "lucide-react";
// import { cloth } from "@lucide/lab";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from "@radix-ui/react-tooltip";

export default function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Initial check on load
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menus = [
    {
      gName: t("Dashboard"),
      childs: [
        { name: t("Home"), link: "/dashboard/home", icon: Home },
        { name: t("Dashboard"), link: "/dashboard/dashboard", icon: LayoutDashboard},
        { name: t("Reports"), link: "/dashboard/reports", icon: FileBarChart2 },
      ],
    },
    {
      gName: t("BusinessEntities"),
      childs: [
        { name: t("ProductCatalogues"), link: "/dashboard/productcatalogues", icon: FolderOpen},
        { name: t("Templates"), link: "/dashboard/templates", icon: SquareScissors},
        { name: t("Orders"), link: "/dashboard/orders", icon: ListOrdered },
        { name: t("Collections"), link: "/dashboard/entities/collections", icon: Boxes},
        { name: t("Colors"), link: "/dashboard/entities/colors", icon: Palette},
        { name: t("Sizes"), link: "/dashboard/entities/sizes", icon: Ruler },
        { name: t("Textiles"), link: "/dashboard/entities/textiles", icon: SwatchBook},
        { name: t("TemplateType"), link: "/dashboard/entities/templatetype", icon: Asterisk},
        { name: t("TemplatePattern"), link: "/dashboard/entities/templatepattern", icon: SquareAsterisk},
        { name: t("ProductCategoryOne"), link: "/dashboard/entities/productcategoryone", icon: ArrowUpDown},
        { name: t("ProductCategoryTwo"), link: "/dashboard/entities/productcategorytwo", icon: ArrowLeftRight},
      ],
    },
    {
      gName: t("Warehouses"),
      childs:
          [
            { name: t("Warehouse"), link: "/dashboard/warehouses", icon: Warehouse},
            { name: t("Suppliers"), link: "/dashboard/suppliers", icon: Container},
            { name: t("MaterialCategory"), link: "/dashboard/materialcategory", icon: SquareStack},
            { name: t("Materials"), link: "/dashboard/materials", icon: Shell},
          ],
    },
    {
      gName: t("StaffRelatedData"),
      childs: [
        { name: t("Departments"), link: "/dashboard/departments", icon: LayoutPanelTop},
        { name: t("Users"), link: "/dashboard/users", icon: UsersRound },
        { name: t("Tasks"), link: "/dashboard/tasks", icon: ListChecks },
        { name: t("Notes"), link: "/dashboard/notes", icon: NotebookPen },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="p-2 border-r-2">
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <AlignJustify /> : undefined}
              style={{ margin: "10px 0 20px 0" }}
            >
              {!isCollapsed && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "0px",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>Department Name</span>
                  <AlignJustify onClick={() => setIsCollapsed(!isCollapsed)} />
                </div>
              )}
            </MenuItem>
            {menus.map((menu, index) => (
              <MenuItem key={index}>
                {!isCollapsed && (
                  <b style={{ marginBottom: "10px", display: "block" }}>
                    {menu.gName}
                  </b>
                )}
                {menu.childs.map((child, idx) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={child.link}
                        className={({ isActive }) =>
                          `flex items-center text-sm px-2 py-[6px] rounded-sm cursor-pointer ${
                            isActive
                              ? "bg-primary-foreground text-primary"
                              : "text-secondary hover:text-primary hover:bg-primary-foreground"
                          }`
                        }
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <child.icon style={{ marginRight: "5px" }} />
                          {!isCollapsed && <span>{child.name}</span>}
                        </div>
                      </NavLink>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" align="center">
                        <TooltipArrow />
                        {child.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </MenuItem>
            ))}
          </Menu>
        </ProSidebar>
      </div>
    </TooltipProvider>
  );
}

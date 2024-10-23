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
  FileBarChart,
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
  Clipboard,
  Package,
} from "lucide-react";
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

import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";

export interface MenuItem {
  name: string;
  link: string;
  icon: any; // Temporarily using 'any' for icon type
  userRole: string[];
}

export interface MenuGroup {
  gName: string;
  childs: MenuItem[];
}

export interface User {
  role?: string;
  // Add other user properties if needed
}

export default function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useRecoilValue(userInfo); // Get user info from global state

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
        {
          name: t("Home"),
          link: "/dashboard/home",
          icon: Home,
          userRole: [
            "FACTORYMANAGER",
            "ENGINEERING",
            "CUTTING",
            "TAILORING",
            "QUALITYASSURANCE",
            "PRINTING",
            "WAREHOUSEMANAGER",
            "HumanResource",
          ],
        },
        {
          name: t("Dashboard"),
          link: "/dashboard/dashboard",
          icon: LayoutDashboard,
          userRole: [
            "FACTORYMANAGER",
            "ENGINEERING",
            "CUTTING",
            "TAILORING",
            "QUALITYASSURANCE",
            "PRINTING",
          ],
        },
        {
          name: t("ProductionReports"),
          link: "/dashboard/productionreports",
          icon: FileBarChart2,
          userRole: ["FACTORYMANAGER"],
        },
        {
          name: t("OrderReports"),
          link: "/dashboard/orderreports",
          icon: FileBarChart,
          userRole: ["FACTORYMANAGER","MotherCompany"],
        },
        /*{
          name: t("Archive"),
          link: "/dashboard/archive",
          icon: Archive,
          userRole: ["FACTORYMANAGER"],
        },*/
      ],
    },
    {
      gName: t("BusinessEntities"),
      childs: [
        {
          name: t("ProductCatalogues"),
          link: "/dashboard/productcatalogues",
          icon: FolderOpen,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("Templates"),
          link: "/dashboard/templates",
          icon: SquareScissors,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("Orders"),
          link: "/dashboard/orders",
          icon: ListOrdered,
          userRole: ["FACTORYMANAGER", "ENGINEERING","MotherCompany"],
        },
        {
          name: t("Collections"),
          link: "/dashboard/entities/collections",
          icon: Boxes,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("Colors"),
          link: "/dashboard/entities/colors",
          icon: Palette,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("Sizes"),
          link: "/dashboard/entities/sizes",
          icon: Ruler,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("Textiles"),
          link: "/dashboard/entities/textiles",
          icon: SwatchBook,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("TemplateType"),
          link: "/dashboard/entities/templatetype",
          icon: Asterisk,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("TemplatePattern"),
          link: "/dashboard/entities/templatepattern",
          icon: SquareAsterisk,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("ProductCategoryOne"),
          link: "/dashboard/entities/productcategoryone",
          icon: ArrowUpDown,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
        {
          name: t("ProductCategoryTwo"),
          link: "/dashboard/entities/productcategorytwo",
          icon: ArrowLeftRight,
          userRole: ["FACTORYMANAGER", "ENGINEERING"],
        },
      ],
    },
    {
      gName: t("Warehouses"),
      childs: [
        {
          name: t("Warehouse"),
          link: "/dashboard/warehouses",
          icon: Warehouse,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
        {
          name: t("Suppliers"),
          link: "/dashboard/suppliers",
          icon: Container,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
        {
          name: t("MaterialCategory"),
          link: "/dashboard/materialcategory",
          icon: SquareStack,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
        {
          name: t("Materials"),
          link: "/dashboard/materials",
          icon: Shell,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
        {
          name: t("MaterialMovement"),
          link: "/dashboard/incoming",
          icon: Package,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
        // {
        //   name: t("Outgoing"),
        //   link: "/dashboard/outgoing",
        //   icon: PackageMinusIcon,
        //   userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        // },
        {
          name: t("MaterialReport"),
          link: "/dashboard/materialreport",
          icon: Clipboard,
          userRole: ["FACTORYMANAGER", "WAREHOUSEMANAGER", "ENGINEERING"],
        },
      ],
    },
    {
      gName: t("StaffRelatedData"),
      childs: [
        {
          name: t("Departments"),
          link: "/dashboard/departments",
          icon: LayoutPanelTop,
          userRole: ["FACTORYMANAGER", "HumanResource"],
        },
        {
          name: t("Users"),
          link: "/dashboard/users",
          icon: UsersRound,
          userRole: ["FACTORYMANAGER", "HumanResource"],
        },
        {
          name: t("Tasks"),
          link: "/dashboard/tasks",
          icon: ListChecks,
          userRole: ["FACTORYMANAGER", "ENGINEERING","MotherCompany","HumanResource"],
        },
        {
          name: t("Notes"),
          link: "/dashboard/notes",
          icon: NotebookPen,
          userRole: ["FACTORYMANAGER", "ENGINEERING","MotherCompany","HumanResource"],
        },
      ],
    },
  ];

  // Filter menus based on user roles
  const filterMenusByRole = (menus: MenuGroup[], role: string): MenuGroup[] => {
    return menus
      .filter((menu) =>
        menu.childs.some((child) => child.userRole.includes(role))
      )
      .map((menu) => ({
        ...menu,
        childs: menu.childs.filter((child) => child.userRole.includes(role)),
      }));
  };

  const filteredMenus = filterMenusByRole(menus, user?.userRole || "");
  const userDepartment = user?.userDepartment ? t(user.userDepartment) : "";

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
                  <span style={{ marginRight: "10px" }}>
                    {" "}
                    {t(userDepartment)}
                  </span>
                  <AlignJustify onClick={() => setIsCollapsed(!isCollapsed)} />
                </div>
              )}
            </MenuItem>
            {filteredMenus.map((menu, index) => (
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

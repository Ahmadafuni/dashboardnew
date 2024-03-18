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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {useTranslation} from 'react-i18next';

export default function Sidebar() {
  const {t} = useTranslation();
  const menus = [
    {
      gName: "System",
      childs: [
        {
          name: t("Home"),
          link: "/dashboard/home",
          icon: Home,
        },
        {
          name: t("Reports"),
          link: "/dashboard/reports",
          icon: LayoutDashboard,
        },
        {
          name: t("Statistics"),
          link: "/dashboard/statistics",
          icon: FileBarChart2,
        },
        {
          name: t("ProductCatalogues"),
          link: "/dashboard/productcatalogues",
          icon: FolderOpen,
        },
        {
          name: t("Templates"),
          link: "/dashboard/templates",
          icon: SquareScissors,
        },
        {
          name: t("Orders"),
          link: "/dashboard/orders",
          icon: ListOrdered,
        },
        {
          name: t("Models"),
          link: "/dashboard/models",
          icon: Shirt,
        },
        {
          name: t("Tasks"),
          link: "/dashboard/tasks",
          icon: ListChecks,
        },
        {
          name: t("Notes"),
          link: "/dashboard/notes",
          icon: NotebookPen,
        },
      ],
    },
    {
      gName: "Manager",
      childs: [
        {
          name: t("Home"),
          link: "/dashboard/home",
          icon: Home,
        },
        {
          name: t("Reports"),
          link: "/dashboard/reports",
          icon: LayoutDashboard,
        },
        {
          name: t("Statistics"),
          link: "/dashboard/statistics",
          icon: FileBarChart2,
        },
        {
          name: t("Users"),
          link: "/dashboard/users",
          icon: UsersRound,
        },
        {
          name: t("Departments"),
          link: "/dashboard/departments",
          icon: LayoutPanelTop,
        },
        {
          name: t("Stores"),
          link: "/dashboard/stores",
          icon: Store,
        },
        {
          name: t("Tasks"),
          link: "/dashboard/tasks",
          icon: ListChecks,
        },
        {
          name: t("Notes"),
          link: "/dashboard/notes",
          icon: NotebookPen,
        },
      ],
    },
  ];
  return (
    <div className="w-[300px] border-r-2 ">
      <div className="p-1">
        {menus.map((menu, index) => (
          <div key={index}>
            <p className="text-muted-foreground font-medium text-xs px-2 py-[6px]">
              {menu.gName}
            </p>
            <ul className="flex flex-col gap-y-1">
              {menu.childs.map((child, idx) => (
                <li key={idx}>
                  <NavLink
                    to={child.link}
                    className={({ isActive }) => {
                      return isActive
                        ? "flex items-center text-primary bg-primary-foreground text-sm px-2 py-[6px] rounded-sm cursor-pointer"
                        : "flex items-center hover:text-primary hover:bg-primary-foreground text-sm px-2 py-[6px] rounded-sm cursor-pointer";
                    }}
                  >
                    <child.icon className="mr-2 h-4 w-4" />
                    <span>{child.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  Users,
  LayoutDashboard,
  Home,
  SquareScissors,
  FolderOpen,
  Shirt,
  ListOrdered,
  ListChecks,
  NotebookPen, UsersRound, LayoutPanelTop, FileBarChart2
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    {
      gName: "System",
      childs: [
        {
          name: "Home",
          link: "/home/home",
          icon: Home,
        },
          {
          name: "Reports",
          link: "/reports/reports",
          icon: LayoutDashboard,
        },
        {
          name: "Statistics",
          link: "/statistics/statistics",
          icon: FileBarChart2,
        },
        {
          name: "Product Catalogues",
          link: "/productcatalogues/productcatalogues",
          icon: FolderOpen,
        },
        {
          name: "Templates",
          link: "/templates/templates",
          icon: SquareScissors,
        },
        {
          name: "Orders",
          link: "/orders/orders",
          icon: ListOrdered,
        },
        {
          name: "Models",
          link: "/models/models",
          icon: Shirt,
        },
        {
          name: "Tasks",
          link: "/tasks/tasks",
          icon: ListChecks,
        },
        {
          name: "Notes",
          link: "/notes/notes",
          icon: NotebookPen,
        },
      ],
    },
    {
      gName: "Manager",
      childs: [
        {
          name: "Home",
          link: "/home/home",
          icon: Home,
        },
        {
          name: "Reports",
          link: "/reports/reports",
          icon: LayoutDashboard,
        },
        {
          name: "Statistics",
          link: "/statistics/statistics",
          icon: FileBarChart2,
        },
        {
          name: "Users",
          link: "/users/users",
          icon: UsersRound,
        },
        {
          name: "Departments",
          link: "/departments/departments",
          icon: LayoutPanelTop,
        },
        {
          name: "Tasks",
          link: "/tasks/tasks",
          icon: ListChecks,
        },
        {
          name: "Notes",
          link: "/notes/notes",
          icon: NotebookPen,
        },
      ]    },
  ];
  return (
    <div className="w-[300px] border-r-2 ">
      <div className="p-1">
        {menus.map((menu) => (
          <>
            <p className="text-muted-foreground font-medium text-xs px-2 py-[6px]">
              {menu.gName}
            </p>
            <ul className="flex flex-col gap-y-1">
              {menu.childs.map((child) => (
                <li>
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
          </>
        ))}
      </div>
    </div>
  );
}

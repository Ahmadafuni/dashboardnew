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
  Store, Proportions, Ruler, Palette, ClipboardType, SquareAsterisk, SquareKanban, SquareGanttChart,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    {
      gName: "System",
      childs: [
        {
          name: "Home",
          link: "/dashboard/home",
          icon: Home,
        },
        {
          name: "Reports",
          link: "/dashboard/reports",
          icon: LayoutDashboard,
        },
        {
          name: "Statistics",
          link: "/dashboard/statistics",
          icon: FileBarChart2,
        },
        {
          name: "Product Catalogues",
          link: "/dashboard/productcatalogues",
          icon: FolderOpen,
        },
        {
          name: "Templates",
          link: "/dashboard/templates",
          icon: SquareScissors,
        },
        {
          name: "Orders",
          link: "/dashboard/orders",
          icon: ListOrdered,
        },
        {
          name: "Models",
          link: "/dashboard/models",
          icon: Shirt,
        },
        {
          name: "Tasks",
          link: "/dashboard/tasks",
          icon: ListChecks,
        },
        {
          name: "Notes",
          link: "/dashboard/notes",
          icon: NotebookPen,
        },
        {
          name: "Entities",
          icon: Proportions,
        },
        {
          name: "Color",
          link: "/dashboard/entities/colors",
          icon: Palette,
        },
        {
          name: "Sizes",
          link: "/dashboard/entities/sizes",
          icon: Ruler,
        },
        {
          name: "Product Category |",
          link: "/dashboard/entities/productcategory1",
          icon: SquareGanttChart,
        },
        {
          name: "Product Category ||",
          link: "/dashboard/entities/productcategory2",
          icon: SquareKanban,
        },
        {
          name: "Template Patterns",
          link: "/dashboard/entities/templatepatterns",
          icon: SquareAsterisk,
        },
        {
          name: "Template Types",
          link: "/dashboard/entities/templatetypes",
          icon: ClipboardType,
        },
      ],
    },
    {
      gName: "Manager",
      childs: [
        {
          name: "Home",
          link: "/dashboard/home",
          icon: Home,
        },
        {
          name: "Reports",
          link: "/dashboard/reports",
          icon: LayoutDashboard,
        },
        {
          name: "Statistics",
          link: "/dashboard/statistics",
          icon: FileBarChart2,
        },
        {
          name: "Users",
          link: "/dashboard/users",
          icon: UsersRound,
        },
        {
          name: "Departments",
          link: "/dashboard/departments",
          icon: LayoutPanelTop,
        },
        {
          name: "Stores",
          link: "/dashboard/stores",
          icon: Store,
        },
        {
          name: "Tasks",
          link: "/dashboard/tasks",
          icon: ListChecks,
        },
        {
          name: "Notes",
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

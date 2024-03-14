import { Users, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    {
      gName: "System",
      childs: [
        {
          name: "Dashboard",
          link: "/dashboard/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      gName: "HR",
      childs: [{ name: "User", link: "/dashboard/user", icon: Users }],
    },
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

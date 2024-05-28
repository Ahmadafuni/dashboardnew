import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bell, Globe, Languages, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider";
import { useRecoilState } from "recoil";
import { userInfo } from "@/store/authentication";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import socket from "@/services/Socket";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Topbar() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [user, setUser] = useRecoilState(userInfo);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ar" : "en";
    setCurrentLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("currentLanguage", newLanguage);
  };

  const [notes, setNotes] = useState<
    {
      Id: number;
      Title: string;
      Description: string;
    }[]
  >([]);

  const checkUser = async () => {
    try {
      const result = await axios.get("auth/session", {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      setUser(result.data.user);
    } catch (error) {
      if (error instanceof AxiosError) {
        Cookies.remove("access_token");
        toast.error(error.response?.data.message);
        navigate("/");
      }
    }
  };

  const getAllNotification = async () => {
    try {
      const { data } = await axios.get("notification/", {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      setNotes(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const getUnreadNotificationCount = async () => {
    try {
      const { data } = await axios.get("notification/unread-count", {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      setUnreadNotifications(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  // Logout
  const logout = () => {
    Cookies.remove("access_token");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (user === null) {
      checkUser();
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      getUnreadNotificationCount();
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      socket.emit("register", user?.userDepartmentId);
    }
    socket.on("notification", (data) => {
      setUnreadNotifications(unreadNotifications + data);
    });
  }, [user]);

  return (
    <div className="flex border-b-2 px-4 py-2 items-center justify-between">
      <div>
        <img src="/public/logos/logo.svg" alt="logo" className="w-[150px]" />
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={toggleLanguage}
          >
            {currentLanguage === "ar" ? (
              <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
              <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            )}
          </Button>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative inline-flex w-fit">
                {unreadNotifications > 0 && (
                  <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-700 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                    {unreadNotifications}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => getAllNotification()}
                >
                  <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Bell className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {notes.map((n) => {
                  return (
                    <Card key={n.Id}>
                      <CardHeader>
                        <CardTitle>{n.Title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{n.Description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {user !== null && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 items-center rounded-full px-3 py-1 hover:bg-secondary transition ease-in-out duration-150 cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {user.userRole}
                  </p>
                </div>
                <Avatar>
                  <AvatarImage
                    src={
                      "https://dashboardbackendnew.onrender.com" +
                      user.userImage
                    }
                    alt="Profile Image"
                  />
                  <AvatarFallback>{user.name.split(" ")[0][0]}</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div className="flex items-center" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

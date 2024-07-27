import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "react-i18next";

interface Props {
    user: any;
}

export default function Notification({ user }: Props) {
    const { t } = useTranslation();
    const [notes, setNotes] = useState<
        {
            Id: number;
            Title: string;
            Description: string;
        }[]
    >([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const getAllNotification = async () => {
        try {
            const url =
                user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING"
                    ? "notification/all"
                    : "notification/";
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            setNotes(data.data.sort((a: any, b: any) => b.Id - a.Id)); // Sort from new to old
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    const getUnreadNotificationCount = async () => {
        try {
            const url =
                user?.userRole === "FACTORYMANAGER" || user?.userRole === "ENGINEERING"
                    ? "notification/unread-count/all"
                    : "notification/unread-count";
            const { data } = await axios.get(url, {
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

    const markAsRead = async (id: number) => {
        try {
            await axios.put(`notification/${id}/read`, null, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            setNotes(notes.filter((note) => note.Id !== id));
            setUnreadNotifications(unreadNotifications - 1);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.put(`notification/clear-all`, null, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            setNotes([]);
            setUnreadNotifications(0);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    useEffect(() => {
        if (user !== null) {
            getUnreadNotificationCount();
            getAllNotification();
        }
    }, [user]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="relative inline-flex w-fit">
                    {unreadNotifications > 0 && (
                        <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 whitespace-nowrap rounded-full bg-indigo-700 px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">
                            {unreadNotifications}
                        </div>
                    )}
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Bell className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader>
                        <SheetTitle className="mr-0">{t("Notifications")}</SheetTitle>
                </SheetHeader>
                <Button className="flex justify-end mt-2" onClick={clearAllNotifications} variant="link" size="sm">
                    {t("ClearAll")}
                </Button>
                <ScrollArea className="flex-grow"> {/* Take up remaining space */}
                    <div className="flex flex-col gap-2 py-2"> {/* Reduced gap and padding */}
                        {notes.map((n) => (
                            <div key={n.Id} className="flex flex-col p-2 border rounded-md text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="font-bold">{n.Title}</div>
                                </div>
                                <div className="flex-grow">{n.Description}</div>
                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={() => markAsRead(n.Id)}
                                        variant="link"
                                        size="sm"
                                    >
                                        {t("MarkAsRead")}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

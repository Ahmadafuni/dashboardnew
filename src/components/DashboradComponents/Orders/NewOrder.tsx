import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import Cookies from "js-cookie";
import OrderForm from "./OrderForm.tsx";
import { newOrderModal } from "@/store/Orders.ts";
import { OrderSchema } from "@/form_schemas/newOrderSchema.ts";
import NewCollection from "@/components/DashboradComponents/Entities/Collections/NewCollection.tsx";
import { CollectionList } from "@/store/Collection.ts";
import { getAllCollectionsList } from "@/services/Collection.services.ts";

type Props = {
  getAllOrders: any;
};

const NewOrder = ({ getAllOrders }: Props) => {
  const [open, setOpen] = useRecoilState(newOrderModal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const setCollectionList = useSetRecoilState(CollectionList);
  const [file, setFile] = useState(null);
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      collection: "",
      description: "",
      orderName: "",
      quantity: "",
      deadline: new Date().toISOString().split("T")[0], // Initialize with today's date
    },
  });

  const onSubmit = async (data: z.infer<typeof OrderSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file !== null) {
        formData.append("orders", file);
      }
      formData.append("collection", data.collection);
      formData.append("description", data.description);
      formData.append("orderName", data.orderName);
      formData.append("quantity", data.quantity);
      formData.append("deadline", data.deadline);
      const newOrder = await axios.post("orders", formData, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(newOrder.data.message);
      getAllOrders();
      form.reset();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getAllCollectionsList(setCollectionList);
  });

  return (
    <div className="w-full space-y-2">
      <NewCollection getAllCollections={setCollectionList} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("NewOrder")}</DialogTitle>
          </DialogHeader>
          <OrderForm
            form={form}
            onSubmit={onSubmit}
            handleFileChange={handleFileChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("Close")}
            </Button>
            <Button type="submit" disabled={isLoading} form="order">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Please wait")}
                </>
              ) : (
                t("Add")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewOrder;

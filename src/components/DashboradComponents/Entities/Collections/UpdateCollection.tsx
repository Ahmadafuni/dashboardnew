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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  Collection,
  CollectionId,
  updateCollectionModal,
} from "@/store/Collection.ts";
import { CollectionSchema } from "@/form_schemas/newCollectionSchema.ts";
import CollectionForm from "@/components/DashboradComponents/Entities/Collections/CollectionForm.tsx";

type Props = {
  getAllCollections: any;
};

export default function UpdateCollection({ getAllCollections }: Props) {
  const collectionID = useRecoilValue(CollectionId);
  const [open, setOpen] = useRecoilState(updateCollectionModal);
  const [isLoading, setIsLoading] = useState(false);
  const currentCollection = useRecoilValue(Collection);
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(CollectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    values: currentCollection,
  });

  const onSubmit = async (data: z.infer<typeof CollectionSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`collections/${collectionID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getAllCollections();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("UpdateCollection")}</DialogTitle>
        </DialogHeader>
        <CollectionForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="collection">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

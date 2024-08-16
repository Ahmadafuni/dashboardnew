import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";
import DataTable from "@/components/common/DataTable.tsx";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { downLoadFile } from "@/services/Commons.services";
import {
  startOrder,
  restartOrder,
  holdOrder,
  deleteOrder,
  getOrderById,
  getArchivedOrders,
  toggleArchivedOrderById,
} from "@/services/Order.services";
import { updateOrderModal, orderId, order } from "@/store/Orders";
import { OrderType } from "@/types/Orders/Orders.types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  EllipsisVertical,
  Pen,
  Eye,
  Plus,
  Download,
  ScanEye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button.tsx";
import {
  deleteModel,
  getArchivedModels,
  holdModel,
  restartModel,
  toggleArchivedModelById,
} from "@/services/Model.services";
import { ModelTypes } from "@/types/Models/Models.types";
import Spinner from "@/components/common/Spinner";

const Archive = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const { t } = useTranslation();
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  const handleRemoveOrderFromArchive = async (orderId: number) => {
    await toggleArchivedOrderById(orderId, false, setIsOrdersLoading);
    await getArchivedOrders(setOrders, setIsOrdersLoading);
  };

  const handleRemoveModelFromArchive = async (modelId: number) => {
    await toggleArchivedModelById(modelId, false, setIsModelsLoading);
    await getArchivedModels(setModels, setIsModelsLoading);
  };

  const orderColumns: ColumnDef<OrderType>[] = [
    {
      accessorKey: "OrderNumber",
      header: t("OrderNumber"),
    },
    {
      accessorKey: "OrderName",
      header: t("OrderName"),
    },
    {
      header: t("Collections"),
      cell: ({ row }) => {
        return <p>{row.original.Collection.CollectionName}</p>;
      },
    },
    {
      accessorKey: "Quantity",
      header: t("Quantity"),
    },
    {
      header: t("DeadlineDate"),
      cell: ({ row }) => {
        // @ts-expect-error
        return <p>{row.original.DeadlineDate.split("T")[0]}</p>;
      },
    },
    {
      accessorKey: "Description",
      header: t("Description"),
    },
    {
      header: t("Status"),
      cell: ({ row }) => {
        return (
          <div className="space-x-1">
            {row.original.Status === "PENDING" ? (
              <BasicConfirmationDialog
                btnText={t("StartOrder")}
                takeAction={() => startOrder(setOrders, row.original.Id)}
                className="bg-green-500 hover:bg-green-600"
              />
            ) : row.original.Status === "ONHOLD" ? (
              <BasicConfirmationDialog
                btnText={t("RestartOrder")}
                takeAction={() => restartOrder(setOrders, row.original.Id)}
                className="bg-green-500 hover:bg-green-600"
              />
            ) : (
              <BasicConfirmationDialog
                btnText={t("HoldOrder")}
                takeAction={(reason: string) =>
                  holdOrder(setOrders, row.original.Id, reason)
                }
                className="bg-orange-500 hover:bg-orange-600"
                showInput={true}
              />
            )}
          </div>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <Button
            className="text-white"
            onClick={() => handleRemoveOrderFromArchive(row.original.Id)}
          >
            Remove From Archive
          </Button>
        );
      },
    },
  ];

  const [models, setModels] = useState<ModelTypes[]>([]);

  const modelColumns: ColumnDef<ModelTypes>[] = [
    {
      accessorKey: "DemoModelNumber",
      header: t("ModelNumber"),
    },
    {
      header: t("ProductCatalogues"),
      cell: ({ row }) => {
        return <p>{row.original.ProductCatalog.ProductCatalogName}</p>;
      },
    },
    {
      header: t("ProductCategoryOne"),
      cell: ({ row }) => {
        return <p>{row.original.CategoryOne.CategoryName}</p>;
      },
    },
    {
      header: t("ProductCategoryTwo"),
      cell: ({ row }) => {
        return <p>{row.original.categoryTwo.CategoryName}</p>;
      },
    },
    {
      header: t("Textiles"),
      cell: ({ row }) => {
        return <p>{row.original.Textile.TextileName}</p>;
      },
    },
    {
      header: t("Template"),
      cell: ({ row }) => {
        return <p>{row.original.Template.TemplateName}</p>;
      },
    },
    {
      accessorKey: "ModelName",
      header: t("ModelName"),
    },
    {
      accessorKey: "Barcode",
      header: t("Barcode"),
    },
    {
      accessorKey: "Status",
      cell: ({ row }) => {
        return (
          <div className="space-x-1">
            {row.original.RunningStatus === "RUNNING" ? (
              <BasicConfirmationDialog
                btnText={t("Pause")}
                takeAction={(reason: string) =>
                  holdModel(setModels, row.original.Id, reason)
                }
                className="bg-orange-500 hover:bg-orange-600"
                showInput={true}
              />
            ) : (
              <BasicConfirmationDialog
                btnText={t("Restart")}
                takeAction={() => restartModel(setModels, row.original.Id)}
                className="bg-green-500 hover:bg-green-600"
              />
            )}
          </div>
        );
      },
    },
    {
      header: t("Action"),
      cell: ({ row }) => {
        return (
          <Button
            className="text-white"
            onClick={() => handleRemoveModelFromArchive(row.original.Id)}
          >
            Remove From Archive
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    getArchivedModels(setModels, setIsModelsLoading);
  }, []);

  useEffect(() => {
    getArchivedOrders(setOrders, setIsOrdersLoading);
  }, []);

  return (
    <>
      <div
        id="datatable"
        className="mt-10"
        style={{
          position: "relative",
        }}
      >
        {(console.log(isOrdersLoading), isOrdersLoading && <Spinner />)}
        <div className="w-full space-y-1">
          <h1 className="text-3xl font-bold w-full">{t("Archived Orders")}</h1>
          <Separator />
        </div>
        <div className="rounded-md border overflow-x-scroll mt-8">
          <DataTable columns={orderColumns} data={orders} />
        </div>
      </div>

      <div
        id="datatable"
        className="mt-10"
        style={{
          position: "relative",
        }}
      >
        {(console.log(isModelsLoading), isModelsLoading && <Spinner />)}
        <div className="w-full space-y-1 mt-10">
          <h1 className="text-3xl font-bold w-full">{t("Archived Models")}</h1>
          <Separator />
        </div>
        <div className="rounded-md border overflow-x-scroll mt-8">
          <DataTable columns={modelColumns} data={models} />
        </div>
      </div>
    </>
  );
};

export default Archive;

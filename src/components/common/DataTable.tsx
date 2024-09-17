import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
import * as Tooltip from "@radix-ui/react-tooltip";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  size?: number;
  setSize?: Dispatch<SetStateAction<number>>;
  totalPages?: number;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  page,
  setPage,
  size,
  setSize,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    // @ts-ignore
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    const now = new Date();
    const currentTimestamp = now
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/, /g, " ")
      .replace(/:/g, "-")
      .replace(/\s/g, "-")
      .replace(/\/|,/g, "-");
    const filename = `data-${currentTimestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-56"
          />
        </div>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button onClick={exportToExcel}>
                <FileText className="w-5 h-5" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Export to Excel</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "flex items-center"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 w-4 h-4" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="ml-2 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (page && page > 1) {
                setPage && setPage((prev) => prev - 1);
              }
            }}
            disabled={page == 1}
            className="mr-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              if (page && totalPages && page < totalPages) {
                setPage && setPage((prev) => prev + 1);
              }
            }}
            disabled={page == totalPages}
            className="mr-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 mr-2">
            Page {page} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            value={size ? size.toString() : "10"}
            onValueChange={(value) => setSize && setSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={size && size.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectScrollUpButton />
              {[10, 20, 30, 40, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
              <SelectScrollDownButton />
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {(table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize}{" "}
            of {table.getFilteredRowModel().rows.length}
          </span>
        </div>
      </div>
    </div>
  );
}

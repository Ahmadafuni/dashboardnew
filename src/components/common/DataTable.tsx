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
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectScrollDownButton, SelectScrollUpButton } from "@/components/ui/select";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, FileText, Minus, Plus } from "lucide-react";
import * as XLSX from 'xlsx';
import * as Tooltip from '@radix-ui/react-tooltip';
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Loader } from 'lucide-react'; 
import * as Dialog from '@radix-ui/react-dialog';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    tableName?: string;
    fieldFilter?: { [key: string]: string }; 
    isDashboard?: boolean;
    stage?: string;
    page?: number;
    setPage?: Dispatch<SetStateAction<number>>;
    size?: number;
    setSize?: Dispatch<SetStateAction<number>>;
    totalPages?: number;
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    tableName,
    fieldFilter,
    isDashboard,
    page,
    setPage,
    size,
    setSize,
    totalPages,
    stage
}: DataTableProps<TData, TValue>) {
    const [filters, setFilters] = useState<{ column: string; value: string }[]>([]);
    const [sorting, setSorting] = useState([]);
    const [fieldNames, setFieldNames] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<TData[]>(data);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const clearAllFilters = () => {
        setFilteredData(data); 
        setFilters([]);
    };
   
    const applyFilters = async () => {
        if(fieldFilter && tableName){

        setIsLoading(true);
        if(tableName == "TrakingModels"){
            try {
                const modelDemoNumber = filters[0].value;
                const response = await axios.get(`/datatable/filter/dashboard/${modelDemoNumber}/${stage}`);
                setFilteredData(response.data.data);
            } catch (error) {
                console.error('Error applying filters:', error);
            } finally {
                setIsLoading(false);
            }
        } else if (tableName == "Models") {
          try {
            const modelDemoNumber = filters[0].value;
            const response = await axios.get(
              `/datatable/filter/report/${modelDemoNumber}`
            );
            // const reports = Array.isArray(response.data.data)
            //   ? response.data.data.flatMap((item: any) => {
            //       const demoModelNumber = item.DemoModelNumber;
            //       const modelName = item.ModelName;
            //       // Map over each variant, ensuring the first variant has model info
            //       return item.Details.map((detail: any, index: any) => ({
            //         modelNumber: index === 0 ? demoModelNumber : "", // First row gets the model number
            //         name: index === 0 ? modelName : "", // First row gets the model name
            //         barcode: index === 0 ? item.Barcode : "", // Example: barcode data if present
            //         textile: index === 0 ? item.Textiles : "", // Only the first row has textile
            //         colors: detail.Color ? detail.Color.ColorName : "",
            //         sizes: detail.Sizes.map(
            //           (size: { label: string; value: string }) =>
            //             `${size.label} : ${size.value}`
            //         ).join(", "),
            //         currentStage: detail.DepartmentName || "N/A",
            //         QuantityDelivered: detail.QuantityDelivered
            //           ? Object.entries(detail.QuantityDelivered)
            //               .map(([size, value]) => `${size} : ${value}`)
            //               .join(" , ")
            //           : "N/A",
            //         QuantityReceived: detail.QuantityReceived
            //           ? Object.entries(detail.QuantityReceived)
            //               .map(([size, value]) => `${size} : ${value}`)
            //               .join(" , ")
            //           : "N/A",
            //         DamagedItem: detail.DamagedItem
            //           ? Object.entries(detail.DamagedItem)
            //               .map(([size, value]) => `${size} : ${value}`)
            //               .join(" , ")
            //           : "N/A",
            //         duration: detail.DurationInHours || "N/A",
            //       }));
            //     })
            //   : [];

            // console.log("response", response.data.data);

            setFilteredData(response.data.data);
          } catch (error) {
            console.error("Error applying filters:", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          for (const filter of filters) {
            if (!filter.column || !filter.value) {
              toast.error(
                "Please select a column and enter a value for all filters."
              );
              setIsLoading(false);
              return;
            }
          }

          // تحويل أسماء الحقول من الأسماء المعروضة إلى الأسماء الفعلية
          const formattedFilters = filters.map((filter) => ({
            // @ts-ignore
            column: fieldFilter[filter.column] || filter.column,
            value: filter.value,
          }));

          try {
            const response = await axios.post(
              `/datatable/filter/${tableName}`,
              { filters: formattedFilters }
            );
            setFilteredData(response.data);
          } catch (error) {
            console.error("Error applying filters:", error);
          } finally {
            setIsLoading(false);
          }
        }
        

    }
};

    const fetchFieldNames = async () => {
        if(fieldFilter && tableName){
            try {
                
                const response = await axios.get(`/datatable/fields/${tableName}`);
                const fieldNamesData = response.data;
                const allFields = fieldNamesData.fields;

                if (isDashboard) {
                    allFields.push({ column_name: 'ModelNumber' });
                }
    
                // @ts-ignore
                const formattedFields = allFields.map(field => {
                const fieldName = field.relatedTable ? `${field.relatedTable}.${field.column_name}` : field.column_name;
                // @ts-ignore
                const displayName = Object.keys(fieldFilter).find(key => fieldFilter[key] === fieldName);
    
                return displayName ? displayName : null;
                }).filter(Boolean);
    
    
                setFieldNames(formattedFields);
            } catch (error) {
                console.error('Error fetching field names:', error);
            }
        }
    };

    useEffect(() => {
        setFilteredData(data); 
        fetchFieldNames();
    }, [data]);


    const table = useReactTable({
        data: filteredData, 
        columns,
        state: {
            sorting,
        },
         // @ts-ignore
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });




    const handleFilterChange = (index: number, field: string, value: string) => {
        const newFilters = [...filters];
        // @ts-ignore
        newFilters[index][field] = value;
        setFilters(newFilters);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData); 
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

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

    return (
        <div>
            {isLoading && (
                <Dialog.Root open={isLoading}>
                    <Dialog.Overlay className="fixed inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 opacity-40 animate-pulse z-50" />
                    
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 animate-fade-in z-50">
                        <div className="flex flex-col items-center">
                            <Loader className="w-16 h-16 animate-spin text-blue-600" />
                            
                            <p className="text-lg font-semibold mt-4 text-gray-700">
                                {t("Applying filters...")}
                            </p>

                            <p className="text-sm mt-2 text-gray-500">
                                {t("Please wait, your request is being processed now.")}
                            </p>
                        </div>
                    </Dialog.Content>
                </Dialog.Root>
            )}

            <div className="flex items-center justify-between mb-4">
             
            
           <div className="flex flex-col gap-4">
                    {
                    filters.length === 0 ? (
                        <Button onClick={() => {

                                setFilters([{ column: '', value: '' }])
                           
                        }}>
                            {t("Add Filter")}
                        </Button>
                    ) : (
                        filters.map((filter, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                {/* Column Selector */}
                                <Select onValueChange={(value) => handleFilterChange(index, 'column', value)}>
                                    <SelectTrigger className="w-full md:w-36 bg-white border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-500 focus:border-blue-500 text-gray-800">
                                        <SelectValue placeholder={t("Select column")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fieldNames.map((fieldName) => (
                                            <SelectItem key={fieldName} value={fieldName}>
                                                {t(fieldName)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                    placeholder= {t("Enter value...")}
                                    className="input w-full md:w-60 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:ring focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Button
                                    className="text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 flex items-center"
                                    onClick={() => setFilters([...filters, { column: '', value: '' }])}
                                >
                                    <Plus size={20} />
                                </Button>

                                {filters.length > 1 && (
                                    <Button
                                        className="text-sm bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2 flex items-center"
                                        onClick={() => {
                                            const updatedFilters = [...filters];
                                            updatedFilters.splice(index, 1);
                                            setFilters(updatedFilters);
                                        }}
                                    >
                                        <Minus size={20} />
                                    </Button>
                                )}
                            </div>
                        ))
                    )
                    
                    }

                    {filters.length > 0 && ( 
                        <div className="w-20">
                            <div className="flex space-x-2">
                                <Button onClick={applyFilters} className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 mt-4">
                                    {t("Apply Filters")}
                                </Button>

                                <Button onClick={clearAllFilters} className="bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2 mt-4">
                                    {t("clear all Filters")}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
               

                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <Button className="bg-green-500 text-white hover:bg-green-600 rounded-md px-4 py-2" onClick={exportToExcel}>
                                <FileText className="w-5 h-5" />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className="text-sm bg-gray-700 text-white p-2 rounded-md">Export to Excel</Tooltip.Content>
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
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center' : 'flex items-center'}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === 'asc' ? (
                                                <ChevronUp className="ml-2 w-4 h-4" />
                                            ) : header.column.getIsSorted() === 'desc' ? (
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
                                    <TableCell

                                    className={
                                        // @ts-ignore
                                        isDashboard && row.original.RunningStatus === 'ONHOLD' ? "bg-orange-500" : ""}
                                    key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-4">
                                No data available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            { isDashboard != true && (
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
                        10 Page {page} of {totalPages}
                        </span>
                    </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <Select
                     value={size ? size.toString() : "10"}
                     onValueChange={(value) => setSize && setSize(Number(value))}
                    >
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder={
                        size && size.toString()
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectScrollUpButton />
                        {[2, 5, 10, 20, 30, 40, 50, 100 , 200].map((s) => (
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
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length}
                    </span>
                </div>
                </div>

        )}
         
            </div>
    );
}

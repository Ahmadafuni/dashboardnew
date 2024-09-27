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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, FileText, Minus, Plus } from "lucide-react";
import * as XLSX from 'xlsx';
import * as Tooltip from '@radix-ui/react-tooltip';
import axios from "axios";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableName: string; 
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    tableName
}: DataTableProps<TData, TValue>) {
    const [filters, setFilters] = useState<{ column: string; value: string }[]>([]);
    const [sorting, setSorting] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [fieldNames, setFieldNames] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<TData[]>(data); // الحالة لتخزين البيانات المفلترة


    const clearAllFilters = () => {
        setFilteredData(data); // إعادة تعيين البيانات الأصلية
        setFilters([]);
    };

    const applyFilters = async () => {
        // Check for empty filter values
        for (const filter of filters) {
            if (!filter.column || !filter.value) {
                toast.error("Please select a column and enter a value for all filters.");
                return;
            }
        }

        try {
            const response = await axios.post(`/datatable/filter/${tableName}`, { filters });
            console.log("response", response.data);
            // تحديث البيانات المفلترة
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    const fetchFieldNames = async () => {
    try {
        const response = await axios.get(`/datatable/fields/${tableName}`);
        const fieldNamesData = response.data;

        // جلب جميع الحقول (من الجدول الرئيسي والجداول المرتبطة)
        const allFields = fieldNamesData.fields;

        // تحويل الحقول المرتبطة إلى صيغة `relatedTable.field`
        // @ts-ignore
        const formattedFields = allFields.map(field => {
            if (field.relatedTable) {
                return `${field.relatedTable}.${field.column_name}`;
            }
            return field.column_name;
        });

        // تحديث حالة الحقول
        setFieldNames(formattedFields);

        console.log("response.data", response.data);
    } catch (error) {
        console.error('Error fetching field names:', error);
    }
};

    
    

    useEffect(() => {
        setFilteredData(data); // تهيئة البيانات المفلترة بالبيانات الأصلية
        fetchFieldNames();
        console.log("FieldNames", fieldNames);
    }, [data]); // تحديث البيانات المفلترة عند تحديث البيانات الأصلية

    const table = useReactTable({
        data: filteredData, // استخدام البيانات المفلترة هنا
        columns,
        state: {
            sorting,
        },
         // @ts-ignore
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

   
    

    const handleFilterChange = (index: number, field: string, value: string) => {
        const newFilters = [...filters];
        // @ts-ignore
        newFilters[index][field] = value;
        setFilters(newFilters);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData); // استخدم البيانات المفلترة هنا
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        const now = new Date();
        const currentTimestamp = now.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(/, /g, ' ').replace(/:/g, '-').replace(/\s/g, '-').replace(/\/|,/g, '-');
        const filename = `data-${currentTimestamp}.xlsx`;
        XLSX.writeFile(wb, filename);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                {/* Filter Section */}
                <div className="flex flex-col gap-4">
                    {filters.length === 0 ? (
                        <Button onClick={() => setFilters([{ column: '', value: '' }])}>
                            Add Filter
                        </Button>
                    ) : (
                        filters.map((filter, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                {/* Column Selector */}
                                <Select onValueChange={(value) => handleFilterChange(index, 'column', value)}>
                                    <SelectTrigger className="w-full md:w-36 bg-white border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-500 focus:border-blue-500 text-gray-800">
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fieldNames.map((fieldName) => (
                                            <SelectItem key={fieldName} value={fieldName}>
                                                {fieldName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Input Field for Filter Value */}
                                <input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                    placeholder="Enter value..."
                                    className="input w-full md:w-60 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:ring focus:ring-blue-500 focus:border-blue-500"
                                />

                                {/* Add filter button */}
                                <Button
                                    className="text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 flex items-center"
                                    onClick={() => setFilters([...filters, { column: '', value: '' }])}
                                >
                                    <Plus size={20} />
                                </Button>

                                {/* Remove filter button */}
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
                    )}

                    {/* Apply Filters Button */}
                    {filters.length > 0 && ( // Show the button only if there are filters
                        <div className="w-20">
                            <div className="flex space-x-2">
                                <Button onClick={applyFilters} className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 mt-4">
                                    Apply Filters
                                </Button>

                                <Button onClick={clearAllFilters} className="bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2 mt-4">
                                    clear all Filters
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Export to Excel */}
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

            {/* Table Section */}
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
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        <span>{table.getFilteredRowModel().rows.length} results</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                            {'<<'}
                        </Button>
                        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            {'<'}
                        </Button>
                        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            {'>'}
                        </Button>
                        <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            {'>>'}
                        </Button>
                    </div>
                    <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50, 100].map((size) => (
                                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

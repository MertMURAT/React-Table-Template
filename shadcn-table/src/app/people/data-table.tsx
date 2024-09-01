"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"

import React from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { downloadToExcel } from "@/src/lib/xlsx"
import { Filter } from "./Filter"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function PeopleDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    }); // Pagination ayarları

    console.log("DATA", data);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        onPaginationChange: (updater) => {
            setPagination((old) => ({
                ...old,
                ...typeof updater === 'function' ? updater(old) : updater,
            }));
        },
        pageCount: Math.ceil(data.length / pagination.pageSize), // Toplam sayfa sayısı
    });


    return (
        <div>
            {/* input */}
            <div className="flex items-center py-4">
                {/* <Input
                    placeholder="Filter First Names"
                    value={table.getColumn('first_name')?.getFilterValue() as string || ""}
                    onChange={(e) => {
                        table.getColumn("first_name")?.setFilterValue(e.target.value);
                    }}
                    className="max-w-sm"
                /> */}

                <Input
                    placeholder="Filter by First Name, Last Name, or Email"
                    value={table.getState().globalFilter || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        table.setGlobalFilter(value);
                    }}
                    className="max-w-sm"
                />

                <Button
                    className="ml-4"
                    onClick={() => downloadToExcel()}>
                    Export to Excel
                </Button>

                <ModeToggle className="ml-4" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className="ml-4">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter(column => column.getCanHide()).map(column => {
                            return (
                                <DropdownMenuCheckboxItem key={column.id} className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value: boolean) => {
                                        column.toggleVisibility(!!value);
                                    }}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className="ml-4">
                            Page Size
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Page Size</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: 10
                                }));
                            }}
                        >
                            10
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: 20
                                }));
                            }}
                        >
                            20
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: 50
                                }));
                            }}
                        >
                            50
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: 100
                                }));
                            }}
                        >
                            100
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => {
                            return (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead key={header.id}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} />
                                                    </div>
                                                ) : null}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    No Results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table >
            </div>
            {/* pagination */}
            <div className="flex items-center justify-start space-x-2 py-4">
                <Button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    variant="outline"
                >
                    {'<<'}
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>

                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    className="px-6"
                >
                    Next
                </Button>
                <Button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    variant="outline"
                >
                    {'>>'}
                </Button>

                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>

                <span className="flex items-center justify-end gap-1">
                    Go to page:
                    <Input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            if (Number(e.target.value) > table.getPageCount()) {
                                table.setPageIndex(table.getPageCount())
                            }
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16 text-center"
                    />
                </span>
            </div>
            <div className="flext-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {` `}
                {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
        </div >
    );
}

export default PeopleDataTable;
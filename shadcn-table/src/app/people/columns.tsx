"use client"
import { Person } from "@/people"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/src/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<Person>[] = [
    {
        id: 'select',
        header: ({ table }) => {
            return <Checkbox checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);
                }}
            />
        },
        cell: ({ row }) => {
            return <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                }}
            />
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: ({ column }) => {
            return (
                <Button variant='ghost' onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}>
                    Person ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        accessorKey: "id",
    },
    {
        header: "First Name",
        accessorKey: "first_name",
    },
    {
        header: "Last Name",
        accessorKey: "last_name",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Gender",
        accessorKey: "gender",
    },
    {
        header: ({ column }) => {
            return (
                <Button variant='ghost' onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}>

                    Date Of Birth
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        accessorKey: "date_of_birth",
        cell: ({ row }) => {
            const date_of_birth = row.getValue("date_of_birth");
            const formatted = new Date(date_of_birth as string).toDateString();
            return <div className="font-medium" > {formatted} </div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const person = row.original
            const personId = person.id
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className="w-8 h-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(person.first_name.toString()); // Örneğin:     kişinin id si alınıp silme işlemi uygulanabilir.
                            }}>
                            Copy person name
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
"use client"
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
import { MeetgridAssociatedEvent } from "@/types/MeetgridAssociatedEvents";
import Link from "next/link";


export const EventDataTableColumns: ColumnDef<MeetgridAssociatedEvent>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Interview Plan Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Button variant="link" asChild className="px-0">
                    <Link href={"/event/" + row.original.id}>{row.getValue("name")}</Link>
                </Button>
            )
        }
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Interview Plan Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Start Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return row.getValue("startDate").toDateString();
        }
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    End Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return row.getValue("endDate").toDateString();
        }
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "dateCreated",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Creation Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return row.getValue("dateCreated").toDateString();
        }
    },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const user = row.original;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal/>
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem>
    //                         <Link href={"/users/edit/" + user.username}>
    //                             Edit Information
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem onClick={async () => {
    //                         const res = await fetch("http://localhost:8080/api/user", {
    //                             method: "DELETE",
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                             },
    //                             body: JSON.stringify({
    //                                 username: user.username,
    //                                 password: user.password,
    //                                 roles: user.roles,
    //                             })
    //                         })
    //                         if (res.ok) {
    //                             console.log("success");
    //                         }
    //                     }}>
    //                         Delete user
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     }
    // }
]
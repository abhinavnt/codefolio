
import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface TableColumn {
    key: string
    title: string
    hidden?: boolean
    render?: (item: any) => React.ReactNode
}

export interface FilterOption {
    id: string
    label: string
    options: { value: string; label: string }[]
    defaultValue: string
}

export interface DataTableProps {
    title: string
    description: string
    data: any[]
    columns: TableColumn[]
    filters: FilterOption[]
    searchPlaceholder: string
    itemsPerPage: number
    totalItems: number
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    onSearch: (term: string) => void
    onFilterChange: (filterId: string, value: string) => void
    renderActions: (item: any) => React.ReactNode
    renderDetails?: (item: any) => React.ReactNode
    getItemIdentifier: (item: any) => string
    getItemName: (item: any) => string
    getItemEmail: (item: any) => string
    getItemImage: (item: any) => string
    getItemStatus: (item: any) => string
}

export function DataTable({
    title,
    description,
    data,
    columns,
    filters,
    searchPlaceholder,
    itemsPerPage,
    totalItems,
    totalPages,
    currentPage,
    onPageChange,
    onSearch,
    onFilterChange,
    renderActions,
    getItemIdentifier,
    getItemName,
    getItemEmail,
    getItemImage,
    getItemStatus,
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        onSearch(e.target.value)
    }

    const indexOfFirstDisplay = (currentPage - 1) * itemsPerPage + 1
    const indexOfLastDisplay = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder={searchPlaceholder}
                                className="pl-8"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            {filters.map((filter) => (
                                <div key={filter.id} className="flex items-center space-x-2">
                                    <Label htmlFor={`${filter.id}-filter`}>{filter.label}:</Label>
                                    <Select
                                        defaultValue={filter.defaultValue}
                                        onValueChange={(value) => onFilterChange(filter.id, value)}
                                    >
                                        <SelectTrigger id={`${filter.id}-filter`} className="w-32">
                                            <SelectValue placeholder={filter.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filter.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableHead key={column.key} className={column.hidden ? "hidden md:table-cell" : ""}>
                                            {column.title}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} className="text-center py-6">
                                            No items found. Try adjusting your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={getItemIdentifier(item)}>
                                            {columns.map((column) => {
                                                if (column.key === "user") {
                                                    return (
                                                        <TableCell key={column.key} className="font-medium">
                                                            <div className="flex items-center space-x-3">
                                                                <Avatar className="hidden sm:flex">
                                                                    <AvatarImage src={getItemImage(item) || "/placeholder.svg"} alt={getItemName(item)} />
                                                                    <AvatarFallback>
                                                                        {getItemName(item)
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{getItemName(item)}</div>
                                                                    <div className="text-sm text-muted-foreground">{getItemEmail(item)}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )
                                                } else if (column.key === "status") {
                                                    return (
                                                        <TableCell key={column.key}>
                                                            <Badge
                                                                className={
                                                                    getItemStatus(item) === "active"
                                                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                                                        : getItemStatus(item) === "blocked" || getItemStatus(item) === "inactive"
                                                                            ? "bg-red-500 hover:bg-red-600"
                                                                            : ""
                                                                }
                                                            >
                                                                {getItemStatus(item)}
                                                            </Badge>
                                                        </TableCell>
                                                    )
                                                } else {
                                                    return (
                                                        <TableCell key={column.key} className={column.hidden ? "hidden md:table-cell" : ""}>
                                                            {column.render ? column.render(item) : item[column.key]}
                                                        </TableCell>
                                                    )
                                                }
                                            })}
                                            <TableCell className="text-right">{renderActions(item)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstDisplay} to {Math.min(indexOfLastDisplay, totalItems)} of {totalItems} items
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink isActive={page === currentPage} onClick={() => onPageChange(page)}>
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                }

                                if (page === 2 && currentPage > 3) {
                                    return (
                                        <PaginationItem key="ellipsis-start">
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }

                                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                    return (
                                        <PaginationItem key="ellipsis-end">
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }

                                return null
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    )
}

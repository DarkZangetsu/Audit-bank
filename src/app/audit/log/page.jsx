"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, PencilLine, PlusCircle, ScrollText, Trash2 } from "lucide-react";

const columns = [
    {
        accessorKey: "dateAction",
        header: "Date d'action",
        cell: ({ row }) => format(new Date(row.getValue("dateAction")), "dd/MM/yyyy HH:mm"),
    },
    {
        accessorKey: "typeAction",
        header: "Type d'action",
        cell: ({ row }) => {
            const type = row.getValue("typeAction");
            const types = {
                CREATE: "Création",
                UPDATE: "Modification",
                DELETE: "Suppression"
            };
            return types[type] || type;
        }
    },
    {
        accessorKey: "numeroCompte",
        header: "Numéro de compte",
    },
    {
        accessorKey: "nomclient",
        header: "Nom du client",
    },
    {
        accessorKey: "soldeAncien",
        header: "Ancien solde",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("soldeAncien"));
            return amount ? new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount) : '-';
        },
    },
    {
        accessorKey: "soldeNouveau",
        header: "Nouveau solde",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("soldeNouveau"));
            return amount ? new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount) : '-';
        },
    },
    {
        accessorKey: "utilisateur",
        header: "Utilisateur",
    },
];

const AuditLogPage = () => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [typeAction, setTypeAction] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: logs,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, typeAction]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (typeAction && typeAction !== 'all') params.append('typeAction', typeAction);

            const response = await fetch(`/api/audit?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données");
            }

            const data = await response.json();

            const formattedLogs = data.logs.map(log => ({
                ...log,
                dateAction: new Date(log.dateAction).toISOString(),
            }));

            setLogs(formattedLogs);
            setStats(data.stats || []);
        } catch (err) {
            setError(err.message);
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };


    const StatCard = ({ title, count, icon: Icon, color }) => (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h2 className="text-3xl font-bold mt-2">{count}</h2>
                    </div>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
            </CardContent>
        </Card>
    );

    return (
        (<SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-4">
                        <SidebarTrigger className="-ml-2" />
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex flex-1 items-center justify-between space-x-2">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/dashboard">
                                            <Home className="mr-2 h-4 w-4 inline" />
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            <ScrollText className="mr-2 h-4 w-4 inline" />
                                            Audit des Logs
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>
                </header>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Audit Logs</h1>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Recherche globale..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Colonnes</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/*Statistics Section */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard
                            title="Ajouts"
                            count={stats.find(s => s.typeAction === 'ajout')?.count || 0}
                            icon={PlusCircle}
                            color="text-green-500"
                        />
                        <StatCard
                            title="Modifications"
                            count={stats.find(s => s.typeAction === 'modification')?.count || 0}
                            icon={PencilLine}
                            color="text-blue-500"
                        />
                        <StatCard
                            title="Suppressions"
                            count={stats.find(s => s.typeAction === 'suppression')?.count || 0}
                            icon={Trash2}
                            color="text-red-500"
                        />
                    </div>


                    <Card>
                        <CardHeader>
                            <CardTitle>Filtres</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm mb-2 block">Date de début</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm mb-2 block">Date de fin</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm mb-2 block">Type d'action</label>
                                <Select value={typeAction} onValueChange={setTypeAction}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les types</SelectItem>
                                        <SelectItem value="ajout">Création</SelectItem>
                                        <SelectItem value="modification">Modification</SelectItem>
                                        <SelectItem value="suppression">Suppression</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Logs d'audit ({logs.length} enregistrements)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-gray-500">Chargement...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                {table.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => (
                                                            <TableHead key={header.id}>
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {table.getRowModel().rows?.length ? (
                                                    table.getRowModel().rows.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            data-state={row.getIsSelected() && "selected"}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={columns.length}
                                                            className="h-24 text-center"
                                                        >
                                                            Aucun résultat.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between space-x-2 py-4">
                                        <div className="flex-1 text-sm text-muted-foreground">
                                            Page {table.getState().pagination.pageIndex + 1} sur{" "}
                                            {table.getPageCount()}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                Précédent
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                Suivant
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-700">
                                                    Lignes par page:
                                                </span>
                                                <Select
                                                    value={`${table.getState().pagination.pageSize}`}
                                                    onValueChange={(value) => {
                                                        table.setPageSize(Number(value));
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8 w-[70px]">
                                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                                    </SelectTrigger>
                                                    <SelectContent side="top">
                                                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                                {pageSize}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>)
    );
};

export default AuditLogPage;
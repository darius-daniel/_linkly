"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVerticalIcon,
  CircleCheckIcon,
  CircleXIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  TrendingUpIcon,
  CopyIcon,
  ExternalLinkIcon,
  TriangleAlert,
  PencilIcon,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { dashboardQueryClient } from "@/app/dashboard/layout";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@/app/generated/prisma/client";
import LinkCreateDialog from "./link-create-dialog";
import LinkCreateButton from "./link-create-btn";

export const schema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  slug: z.string(),
  url: z.string(),
  userID: z.string().nullable().optional(),
  clicks: z.number(),
  expiresAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type LinkRow = z.infer<typeof schema>;

function getLinkStatus(link: LinkRow): "Active" | "Inactive" {
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return "Inactive";
  }
  return "Active";
}

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVerticalIcon className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1">
        <CircleCheckIcon className="size-3 fill-green-500 dark:fill-green-400 text-white dark:text-black" />
        Active
      </Badge>
    );
  }
  if (status === "Expired") {
    return (
      <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1">
        <CircleXIcon className="size-3 text-red-500 dark:text-red-400" />
        Expired
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1">
      <CircleDotIcon className="size-3 text-yellow-500 dark:text-yellow-400" />
      Inactive
    </Badge>
  );
}

const columns: ColumnDef<LinkRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "slug",
    header: "Short Link",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "url",
    header: "Destination",
    cell: ({ row }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground flex max-w-[240px] items-center gap-1 truncate text-xs hover:text-foreground"
      >
        <span className="truncate">
          {row.original.url.replace(/^https?:\/\//, "")}
        </span>
        <ExternalLinkIcon className="size-3 shrink-0" />
      </a>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getLinkStatus(row.original);

      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
        </div>
      );
    },
    filterFn: (row, _columnId, filterValue) => {
      return getLinkStatus(row.original) === filterValue;
    },
  },
  {
    accessorKey: "clicks",
    header: () => <div className="w-full text-right">Clicks</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-medium text-xs">
        {row.original.clicks.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const linkDeleteMutation = useMutation({
        mutationFn: async () => {
          const response = await axiosInstance.delete(
            `/links/${row.original.id}`,
          );

          response.status === 500
            ? toast.error("Deletion failed", {
                icon: <TriangleAlert color="red" />,
              })
            : toast.success("Deleted successfully", {
                icon: <CircleCheckIcon color="green" />,
              });
        },
        onSuccess: () => {
          const cachedLinks = dashboardQueryClient.getQueryData([
            "links",
          ]) as Link[];
          dashboardQueryClient.setQueryData(
            ["links"],
            cachedLinks.filter((item) => item.id !== row.original.id),
          );
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 flex flex-col gap-2">
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://lnkly.io/${row.original.slug}`,
                );
                toast.success("Copied to clipboard", {
                  icon: <CircleCheckIcon color="green" />,
                });
              }}
            >
              <CopyIcon className="mr-2 size-3.5" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs">
              <a
                href={row.original.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="mr-2 size-3.5" />
                Visit URL
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" onClick={() => {}}>
              <PencilIcon className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                linkDeleteMutation.mutate();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<LinkRow> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData }: { data: LinkRow[] }) {
  const [data, setData] = React.useState(() => initialData);
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeTab, setActiveTab] = React.useState("all");
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const filteredData = React.useMemo(() => {
    if (activeTab === "active")
      return data.filter((d) => getLinkStatus(d) === "Active");
    if (activeTab === "expired")
      return data.filter((d) => getLinkStatus(d) === "Inactive");
    return data;
  }, [data, activeTab]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({ id }) => id as UniqueIdentifier) || [],
    [filteredData],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = data.findIndex((d) => d.id === active.id);
        const newIndex = data.findIndex((d) => d.id === over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const counts = React.useMemo(
    () => ({
      active: data.filter((d) => getLinkStatus(d) === "Active").length,
      expired: data.filter((d) => getLinkStatus(d) === "Inactive").length,
    }),
    [data],
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Links</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All Links</TabsTrigger>
          <TabsTrigger value="active">
            Active <Badge variant="secondary">{counts.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired <Badge variant="secondary">{counts.expired}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <LinkCreateDialog triggerBtn={<LinkCreateButton />} />
        </div>
      </div>

      {["all", "active", "expired"].map((tab) => (
        <TabsContent
          key={tab}
          value={tab}
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No links found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectGroup>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Sparkline data for the drawer
const sparkData = [
  { day: "Mon", clicks: 42 },
  { day: "Tue", clicks: 78 },
  { day: "Wed", clicks: 61 },
  { day: "Thu", clicks: 94 },
  { day: "Fri", clicks: 130 },
  { day: "Sat", clicks: 85 },
  { day: "Sun", clicks: 57 },
];

const sparkConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: LinkRow }) {
  const isMobile = useIsMobile();
  const shortUrl = `lnkly.io/${item.slug}`;
  const status = getLinkStatus(item);

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left font-mono text-xs"
        >
          {shortUrl}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="font-mono">{shortUrl}</DrawerTitle>
          <DrawerDescription className="truncate text-xs">
            {item.url}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={sparkConfig} className="h-[120px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={sparkData}
                  margin={{ left: 0, right: 10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="clicks"
                    type="natural"
                    fill="var(--color-clicks)"
                    fillOpacity={0.4}
                    stroke="var(--color-clicks)"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  {item.clicks.toLocaleString()} total clicks{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Click activity over the last 7 days
                </div>
              </div>
              <Separator />
            </>
          )}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 800)),
                {
                  loading: "Saving changes…",
                  success: "Link updated",
                  error: "Error saving",
                },
              );
            }}
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                defaultValue={item.title ?? ""}
                placeholder="Optional title"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" defaultValue={item.slug} className="font-mono" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="url">Destination URL</Label>
              <Input id="url" defaultValue={item.url} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={status} disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="expires_at">Expires</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  defaultValue={
                    item.expiresAt
                      ? new Date(item.expiresAt).toISOString().slice(0, 16)
                      : ""
                  }
                  placeholder="Never"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="created_at">Created</Label>
              <Input
                id="created_at"
                defaultValue={new Date(item.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
                disabled
              />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button
            onClick={() =>
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 800)),
                { loading: "Saving…", success: "Link updated", error: "Error" },
              )
            }
          >
            Save changes
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

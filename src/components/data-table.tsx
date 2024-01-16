import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { DataTablePagination } from "./table-pagination";

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  initialSortingState?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  initialSortingState = [],
}: TableProps<TData, TValue>) {
  // 当数据大于 N 条时使用分页。
  const showPagination = useMemo(() => {
    return data.length > 10;
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>(initialSortingState);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No Result.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <div className="absolute bottom-0 left-0 right-0 top-0 flex bg-background ">
                <ReloadIcon className="m-auto h-5 w-5 animate-spin text-muted-foreground"></ReloadIcon>
              </div>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}

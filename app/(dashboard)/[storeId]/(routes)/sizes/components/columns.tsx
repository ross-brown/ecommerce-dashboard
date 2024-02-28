"use client";

import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

const numericSortingFn: SortingFn<SizeColumn> = (rowA, rowB, direction) => {
  const valueA = parseFloat(rowA.original.value);
  const valueB = parseFloat(rowB.original.value);

  if (valueA < valueB) {
    return direction === 'asc' ? -1 : 1;
  }
  if (valueA > valueB) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: numericSortingFn,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];

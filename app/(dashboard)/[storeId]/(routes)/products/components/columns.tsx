"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import ReactCountryFlag from "react-country-flag";
import { Review } from "@prisma/client";

export type ProductColumn = {
  id: string;
  name: string;
  description: string;
  price: string;
  size: string;
  category: string;
  country: string;
  reviews: Review[]; //FIXME: add as a column too
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived"
  },
  {
    accessorKey: "isFeatured",
    header: "Featured"
  },
  {
    accessorKey: "price",
    header: "Price"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "size",
    header: "Size"
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="flex items-start justify-between">
        <ReactCountryFlag
          countryCode={row.original.country}
          svg
          alt={row.original.country}
          style={{ width: "2.5rem", height: "1.25rem" }}
        />
      </div>
    )
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-xs">
        {row.original.description}
      </div>
    )
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

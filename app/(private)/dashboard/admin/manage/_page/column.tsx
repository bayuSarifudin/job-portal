"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Applicant } from "./hook";

export const columns: ColumnDef<Applicant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "full_name",
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phone_number",
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    id: "date_of_birth",
    accessorKey: "date_of_birth",
    header: "Date of Birth",
  },
  {
    id: "domicile",
    accessorKey: "domicile",
    header: "Domicile",
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
  },
  {
    id: "linkedin_link",
    accessorKey: "linkedin_link",
    header: "Linkedin Link",
  },
];

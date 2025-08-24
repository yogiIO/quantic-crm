import React from "react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import type { CustomerFormValues } from "../create-customers";
import { TextInput } from "@mantine/core";

interface Props {
  customers: CustomerFormValues[];
  fetching: boolean;
  sortStatus: DataTableSortStatus;
  onSortChange: (status: DataTableSortStatus) => void;
  filterText: string;
  onFilterChange: (value: string) => void;
  page: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
}

const columns = [
  { accessor: "name", sortable: true, title: "Name" },
  { accessor: "email", sortable: true, title: "Email" },
  { accessor: "phone", sortable: true, title: "Phone" },
  { accessor: "billingAddress", sortable: true, title: "Billing Address" },
  { accessor: "shippingAddress", sortable: true, title: "Shipping Address" },
];

export const CustomerListingTable: React.FC<Props> = ({
  customers,
  fetching,
  sortStatus,
  onSortChange,
  filterText,
  onFilterChange,
  page,
  totalRecords,
  recordsPerPage,
  onPageChange,
}) => {
  return (
    <>
      <TextInput
        type="text"
        placeholder="Filter by name or email"
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />

      <DataTable
        minHeight={300}
        columns={columns}
        records={customers}
        fetching={fetching}
        sortStatus={sortStatus}
        onSortStatusChange={onSortChange}
        withTableBorder
        borderRadius="md"
        withColumnBorders
        striped
        highlightOnHover
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        page={page}
        onPageChange={onPageChange}
      />
    </>
  );
};

import React from "react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import { TextInput, Badge } from "@mantine/core";

export interface InvoiceListRow {
  invoiceNumber: string;
  customer: string;
  date: string;
  total: number;
  status: "paid" | "unpaid";
}

interface InvoiceListingProps {
  invoices: InvoiceListRow[];
  fetching: boolean;
  sortStatus: DataTableSortStatus<InvoiceListRow>;
  onSortChange: (status: DataTableSortStatus<InvoiceListRow>) => void;
  filterText: string;
  onFilterChange: (value: string) => void;
  page: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
}

const columns: DataTableColumn<InvoiceListRow>[] = [
  { accessor: "invoiceNumber", sortable: true, title: "INVOICE #" },
  { accessor: "customer", sortable: true, title: "CUSTOMER" },
  { accessor: "date", sortable: true, title: "DATE" },
  {
    accessor: "total",
    sortable: true,
    title: "TOTAL",
    render: (row: InvoiceListRow) => `$${row.total.toFixed(2)}`,
  },
  {
    accessor: "status",
    sortable: true,
    title: "STATUS",
    render: (row: InvoiceListRow) => (
      <Badge color={row.status === "paid" ? "green" : "yellow"} variant="light">
        {row.status}
      </Badge>
    ),
  },
];

export const InvoiceListingTable: React.FC<InvoiceListingProps> = ({
  invoices,
  fetching,
  sortStatus,
  onSortChange,
  filterText,
  onFilterChange,
  page,
  totalRecords,
  recordsPerPage,
  onPageChange,
}) => (
  <>
    <TextInput
      type="text"
      placeholder="Filter by invoice # or customer"
      value={filterText}
      onChange={(e) => onFilterChange(e.target.value)}
      style={{ maxWidth: 300 }}
    />
    <DataTable<InvoiceListRow>
      minHeight={200}
      columns={columns}
      records={invoices}
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

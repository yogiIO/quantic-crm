import React, { useEffect, useState, useMemo } from "react";
import localforage from "localforage";
import type { DataTableSortStatus } from "mantine-datatable";
import {
  InvoiceListingTable,
  type InvoiceListRow,
} from "./InvoiceListingTable";
import type { CustomerFormValues } from "../create-customers";

const RECORDS_PER_PAGE = 10;

export interface InvoiceItem {
  description: string;
  quantity?: number;
  price: number;
  taxRate: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    totalTax: number;
    grandTotal: number;
  };
  status?: "paid" | "unpaid";
}

export const InvoiceListingContainer: React.FC = () => {
  const [rows, setRows] = useState<InvoiceListRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<InvoiceListRow>
  >({
    columnAccessor: "invoiceNumber",
    direction: "desc",
  });

  useEffect(() => {
    const fetchRows = async () => {
      setFetching(true);
      const customers: CustomerFormValues[] =
        (await localforage.getItem("customers")) || [];
      const customerMap = new Map(customers.map((c) => [c.email, c.name]));

      const invoices = (await localforage.getItem<Invoice[]>("invoices")) || [];

      const mapped: InvoiceListRow[] = invoices.map((inv) => ({
        invoiceNumber: inv.id,
        customer: customerMap.get(inv.customerId) || "(Unknown)",
        date: inv.dueDate ? inv.dueDate.split("-").reverse().join("/") : "",
        total: inv.totals?.grandTotal ?? 0,
        status: inv.status || "unpaid",
      }));

      setRows(mapped);
      setFetching(false);
    };
    fetchRows();
  }, []);

  const filtered = useMemo(() => {
    const lower = filterText.toLowerCase();
    return rows.filter(
      (row) =>
        row.invoiceNumber.toLowerCase().includes(lower) ||
        row.customer.toLowerCase().includes(lower)
    );
  }, [rows, filterText]);

  const sortedPaged = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortStatus.columnAccessor as keyof InvoiceListRow] ?? "";
      const bVal = b[sortStatus.columnAccessor as keyof InvoiceListRow] ?? "";
      return sortStatus.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    const from = (page - 1) * RECORDS_PER_PAGE;
    return sorted.slice(from, from + RECORDS_PER_PAGE);
  }, [filtered, sortStatus, page]);

  const handleSetFilterText = (text: string) => {
    setFilterText(text);
    setPage(1);
  };

  return (
    <InvoiceListingTable
      invoices={sortedPaged}
      fetching={fetching}
      sortStatus={sortStatus}
      onSortChange={setSortStatus}
      filterText={filterText}
      onFilterChange={handleSetFilterText}
      page={page}
      totalRecords={filtered.length}
      recordsPerPage={RECORDS_PER_PAGE}
      onPageChange={setPage}
    />
  );
};

export default InvoiceListingContainer;

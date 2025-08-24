import React, { useEffect, useState, useMemo } from "react";
import localforage from "localforage";
import type { CustomerFormValues } from "../create-customers";
import type { DataTableSortStatus } from "mantine-datatable";
import { CustomerListingTable } from "./CustomerListTable";

const RECORDS_PER_PAGE = 10;

export const CustomerListingContainer: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerFormValues[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [page, setPage] = useState(1);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  useEffect(() => {
    async function fetchCustomers() {
      setFetching(true);
      const data =
        (await localforage.getItem<CustomerFormValues[]>("customers")) || [];
      setCustomers(data);
      setFetching(false);
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const lower = filterText.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower)
    );
  }, [customers, filterText]);

  const sortedAndPaged = useMemo(() => {
    const sorted = [...filteredCustomers].sort((a, b) => {
      const aVal = (a[sortStatus.columnAccessor as keyof CustomerFormValues] ||
        "") as string;
      const bVal = (b[sortStatus.columnAccessor as keyof CustomerFormValues] ||
        "") as string;
      return sortStatus.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    const from = (page - 1) * RECORDS_PER_PAGE;
    return sorted.slice(from, from + RECORDS_PER_PAGE);
  }, [filteredCustomers, sortStatus, page]);
  const handleSetFilterText = (text: string) => {
    setFilterText(text);
    setPage(1);
  };
  return (
    <CustomerListingTable
      customers={sortedAndPaged}
      fetching={fetching}
      sortStatus={sortStatus}
      onSortChange={setSortStatus}
      filterText={filterText}
      onFilterChange={handleSetFilterText}
      page={page}
      totalRecords={filteredCustomers.length}
      recordsPerPage={RECORDS_PER_PAGE}
      onPageChange={setPage}
    />
  );
};

export default CustomerListingContainer;

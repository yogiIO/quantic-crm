import React, { useEffect, useState } from "react";
import localforage from "localforage";
import type { CustomerFormValues } from "../create-customers";
import { InvoiceForm, type InvoiceFormData } from "./InvoiceForm";

export const InvoiceFormContainer: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerFormValues[]>([]);
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerId: null,
    date: "",
    dueDate: "",
    items: [],
    newItem: {
      description: "",
      price: 0,
      taxRate: 10,
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const savedCustomers =
        (await localforage.getItem<CustomerFormValues[]>("customers")) || [];
      setCustomers(savedCustomers);
    };
    fetchCustomers();
  }, []);

  const computed = React.useMemo(() => {
    const subtotal = formData.items.reduce((acc, item) => acc + item.price, 0);
    const totalTax = formData.items.reduce(
      (acc, item) => acc + item.price * (item.taxRate / 100),
      0
    );
    const grandTotal = subtotal + totalTax;
    return { subtotal, totalTax, grandTotal };
  }, [formData.items]);

  const onChange = (newData: InvoiceFormData) => {
    setFormData(newData);
  };

  const onItemAdd = () => {
    const { description, price, taxRate } = formData.newItem;
    if (!description) return alert("Item description is required");
    if (price < 0) return alert("Quantity and price must be positive");

    setFormData((data) => ({
      ...data,
      items: [...data.items, { description, price, taxRate }],
      newItem: { description: "", quantity: 1, price: 0, taxRate: 10 },
    }));
  };

  const onItemDelete = (index: number) => {
    setFormData((data) => {
      const newItems = data.items.filter((_, i) => i !== index);
      return { ...data, items: newItems };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return alert("Please select a customer");
    if (!formData.date || !formData.dueDate)
      return alert("Please select dates");
    if (formData.items.length === 0) return alert("Add at least one item");

    setSubmitting(true);

    try {
      const invoices =
        (await localforage.getItem<InvoiceFormData[]>("invoices")) || [];

      const invoiceToSave = {
        id: Date.now().toString(),
        customerId: formData.customerId,
        date: formData.date,
        dueDate: formData.dueDate,
        items: formData.items,
        totals: computed,
      };

      await localforage.setItem("invoices", [...invoices, invoiceToSave]);

      alert("Invoice created successfully!");
      setFormData({
        customerId: null,
        date: "",
        dueDate: "",
        items: [],
        newItem: { description: "", price: 0, taxRate: 10 },
      });
    } catch (err) {
      console.log(err);
      alert("Error saving invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InvoiceForm
      customers={customers}
      formData={formData}
      onChange={onChange}
      onItemAdd={onItemAdd}
      onItemDelete={onItemDelete}
      onSubmit={onSubmit}
      computed={computed}
      submitting={submitting}
    />
  );
};

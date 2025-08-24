import React from "react";
import {
  Button,
  Table,
  Select,
  Group,
  TextInput,
  NumberInput,
  TableTd,
  TableTh,
  TableTr,
  TableThead,
  TableTbody,
  Stack,
  Text,
  Divider,
} from "@mantine/core";
import type { CustomerFormValues } from "../create-customers";

export interface InvoiceItem {
  description: string;
  price: number;
  taxRate: number;
}

export interface InvoiceFormData {
  customerId: string | null;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  newItem: InvoiceItem;
}

interface Props {
  customers: CustomerFormValues[];
  formData: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
  onItemAdd: () => void;
  onItemDelete: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  computed: { subtotal: number; totalTax: number; grandTotal: number };
  submitting: boolean;
}

export const InvoiceForm: React.FC<Props> = ({
  customers,
  formData,
  onChange,
  onItemAdd,
  onItemDelete,
  onSubmit,
  computed,
  submitting,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Select
          label="Customer"
          data={customers.map((c) => ({
            value: c.email,
            label: `${c.name} (${c.email})`,
          }))}
          searchable
          value={formData.customerId}
          onChange={(value) => onChange({ ...formData, customerId: value })}
        />

        <Group grow>
          <TextInput
            label="Invoice Date"
            type="date"
            value={formData.date}
            onChange={(e) => onChange({ ...formData, date: e.target.value })}
          />
          <TextInput
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => onChange({ ...formData, dueDate: e.target.value })}
          />
        </Group>

        <Group align="flex-end">
          <TextInput
            label="Item Name"
            value={formData.newItem.description}
            onChange={(e) =>
              onChange({
                ...formData,
                newItem: { ...formData.newItem, description: e.target.value },
              })
            }
            style={{ flex: 2 }}
          />
          <NumberInput
            label="Price"
            value={formData.newItem.price}
            min={0}
            onChange={(value) =>
              onChange({
                ...formData,
                newItem: { ...formData.newItem, price: (value as number) || 0 },
              })
            }
            style={{ flex: 1 }}
          />
          <Select
            label="Tax Rate (%)"
            data={["0", "5", "10", "18", "28"].map((r) => ({
              value: r,
              label: r,
            }))}
            value={formData.newItem.taxRate.toString()}
            onChange={(value) =>
              onChange({
                ...formData,
                newItem: { ...formData.newItem, taxRate: Number(value) },
              })
            }
            style={{ flex: 1 }}
          />
          <Button onClick={onItemAdd} variant="outline">
            + Add Item
          </Button>
        </Group>
        <Divider my="md" />
        {formData.items.length > 0 && (
          <Table striped>
            <TableThead>
              <TableTr>
                <TableTh>ITEM</TableTh>
                <TableTh>PRICE</TableTh>
                <TableTh>TAX %</TableTh>
                <TableTh>SUBTOTAL</TableTh>
                <TableTh></TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {formData.items.length === 0 ? (
                <TableTr>
                  <TableTd colSpan={6}>No items added</TableTd>
                </TableTr>
              ) : (
                formData.items.map((item, idx) => (
                  <TableTr key={idx}>
                    <TableTd>{item.description}</TableTd>
                    <TableTd>{item.price.toFixed(2)}</TableTd>
                    <TableTd>{item.taxRate}</TableTd>
                    <TableTd>
                      {(item.price * (1 + item.taxRate / 100)).toFixed(2)}
                    </TableTd>
                    <TableTd>
                      <Button size="xs" onClick={() => onItemDelete(idx)}>
                        Delete
                      </Button>
                    </TableTd>
                  </TableTr>
                ))
              )}
            </TableTbody>
          </Table>
        )}

        <Group justify="space-between" w={"100%"} py={"md"}>
          <Stack w={"100%"}>
            <Group justify="space-between" w={"100%"}>
              <Text fw={"lighter"}>
                Subtotal: ${computed.subtotal.toFixed(2)}
              </Text>
              <Text fw={"lighter"}>
                Total Tax: ${computed.totalTax.toFixed(2)}
              </Text>
            </Group>
            <Text fw={"bolder"} size={"md"}>
              <strong>Grand Total: ${computed.grandTotal.toFixed(2)}</strong>
            </Text>
          </Stack>
        </Group>

        <Button type="submit" ml={"auto"} loading={submitting}>
          Create Invoice
        </Button>
      </Stack>
    </form>
  );
};

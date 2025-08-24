import { Divider, Stack } from "@mantine/core";
import { InvoiceFormContainer } from "./InvoiceFormContainer";
import { InvoiceListingContainer } from "./InvoiceListingContainer";

export default function Invoices() {
  return (
    <Stack>
      <InvoiceFormContainer />
      <Divider my="md" />
      <InvoiceListingContainer />
    </Stack>
  );
}

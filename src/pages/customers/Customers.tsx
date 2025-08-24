import { Stack } from "@mantine/core";
import CustomerListHeader from "./CustomerListHeader";
import ListCustomers from "./ListCustomers";

export default function Customers() {
  return (
    <Stack>
      <CustomerListHeader />
      <ListCustomers />
    </Stack>
  );
}

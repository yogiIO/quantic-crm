import React from "react";
import { Group, Title, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../routes/route-path";

const CustomerListHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate(RoutePath.CREATE_CUSTOMER);
  };

  return (
    <Group justify="space-between" mb="md">
      <Title order={2}>Customers</Title>
      <Button onClick={handleCreateClick} variant="filled">
        Add Customer
      </Button>
    </Group>
  );
};

export default CustomerListHeader;

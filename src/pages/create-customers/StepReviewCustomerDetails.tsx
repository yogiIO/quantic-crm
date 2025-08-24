import React from "react";
import { Text, Checkbox, Stack } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";

const StepReviewCustomerDetails: React.FC = () => {
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext();

  const values = getValues();

  return (
    <Stack maw={600} mx="auto">
      <Text fw={700} size="lg" mb="md">
        Please review your information
      </Text>

      <Text>
        <strong>Name:</strong> {values.name}
      </Text>
      <Text>
        <strong>Email:</strong> {values.email}
      </Text>
      <Text>
        <strong>Phone:</strong> {values.phone || "N/A"}
      </Text>
      <Text>
        <strong>Billing Address:</strong> {values.billingAddress}
      </Text>
      <Text>
        <strong>Shipping Address:</strong>{" "}
        {values.copyBillingToShipping
          ? values.billingAddress
          : values.shippingAddress}
      </Text>

      <Controller
        name="agreeTerms"
        control={control}
        rules={{ required: "You must agree to terms" }}
        render={({ field }) => (
          <Checkbox
            label="I agree to the Terms and Conditions"
            checked={field.value || false}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
            error={errors.agreeTerms?.message as string | undefined}
            mt="md"
          />
        )}
      />
    </Stack>
  );
};

export default StepReviewCustomerDetails;

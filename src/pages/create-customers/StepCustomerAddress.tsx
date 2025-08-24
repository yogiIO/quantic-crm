import { useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { TextInput, Checkbox, Stack } from "@mantine/core";

const StepCustomerAddress: React.FC = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const copyBillingToShipping = useWatch({
    control,
    name: "copyBillingToShipping",
  });

  useEffect(() => {
    if (copyBillingToShipping) {
      const billingAddress = control._formValues?.billingAddress || "";
      setValue("shippingAddress", billingAddress);
    }
  }, [copyBillingToShipping, control, setValue]);

  return (
    <Stack maw={600} mx="auto">
      <Controller
        name="billingAddress"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Billing Address"
            placeholder="Enter billing address"
            error={errors.billingAddress?.message as string | undefined}
            {...field}
          />
        )}
      />

      <Controller
        name="copyBillingToShipping"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Shipping address same as billing"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />

      {!copyBillingToShipping && (
        <Controller
          name="shippingAddress"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Shipping Address"
              placeholder="Enter shipping address"
              error={errors.shippingAddress?.message as string | undefined}
              {...field}
            />
          )}
        />
      )}
    </Stack>
  );
};

export default StepCustomerAddress;

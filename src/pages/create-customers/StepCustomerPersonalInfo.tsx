import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextInput, Stack } from "@mantine/core";

const StepCustomerPersonalInfo: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack maw={600} mx="auto">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Name"
            placeholder="Enter your name"
            error={errors.name?.message as string | undefined}
            {...field}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextInput
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message as string | undefined}
            {...field}
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Phone"
            placeholder="Enter your phone number"
            error={errors.phone?.message as string | undefined}
            {...field}
          />
        )}
      />
    </Stack>
  );
};

export default StepCustomerPersonalInfo;

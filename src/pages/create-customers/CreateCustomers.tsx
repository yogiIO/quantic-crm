import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stepper, Button, Group, Box, Modal, Text } from "@mantine/core";
import localforage from "localforage";
import * as z from "zod";
import StepCustomerPersonalInfo from "./StepCustomerPersonalInfo";
import StepCustomerAddress from "./StepCustomerAddress";
import StepReviewCustomerDetails from "./StepReviewCustomerDetails";
import { IconThumbUpFilled } from "@tabler/icons-react";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?\d+$/.test(val),
      "Phone number must contain only digits"
    ),
  billingAddress: z.string().min(1, "Billing address is required"),
  copyBillingToShipping: z.boolean(),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to terms"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

const CreateCustomers: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const nextStep = async () => {
    let fieldsToValidate: (keyof CustomerFormValues)[] = [];

    if (activeStep === 0) {
      fieldsToValidate = ["name", "email", "phone"];

      const valid = await methods.trigger(fieldsToValidate);

      if (!valid) {
        return;
      }

      const email = methods.getValues("email");
      const customers =
        (await localforage.getItem<CustomerFormValues[]>("customers")) || [];
      const emailExists = customers.some((c) => c.email === email);

      if (emailExists) {
        methods.setError("email", {
          type: "manual",
          message: "Email already exists",
        });
        return;
      }

      methods.clearErrors("email");

      setActiveStep((current) => Math.min(current + 1, 2));
      return;
    }

    if (activeStep === 1) {
      fieldsToValidate = ["billingAddress", "copyBillingToShipping"];
      if (!methods.getValues("copyBillingToShipping")) {
        fieldsToValidate.push("shippingAddress");
      }
    }

    const valid = await methods.trigger(fieldsToValidate);
    if (valid) {
      setActiveStep((current) => Math.min(current + 1, 2));
    }
  };

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      billingAddress: "",
      copyBillingToShipping: false,
      shippingAddress: "",
      agreeTerms: false,
    },
  });

  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const customers =
        (await localforage.getItem<CustomerFormValues[]>("customers")) || [];
      customers.push(data);
      await localforage.setItem("customers", customers);
      methods.reset();
      setCompleted(true);
      setActiveStep(0);
    } catch {
      alert("Failed to save customer");
    }
  };

  return (
    <>
      <Modal
        opened={completed}
        onClose={() => setCompleted(false)}
        title={
          <Group>
            <IconThumbUpFilled />
            <Text>Customer Created Successfully!</Text>
          </Group>
        }
      />
      <FormProvider {...methods}>
        <Box maw={700} mx="auto">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stepper active={activeStep}>
              <Stepper.Step
                label="Personal Info"
                description="Your basic information"
              >
                <StepCustomerPersonalInfo />
              </Stepper.Step>

              <Stepper.Step
                label="Address Info"
                description="Billing and shipping"
              >
                <StepCustomerAddress />
              </Stepper.Step>

              <Stepper.Step
                label="Review & Submit"
                description="Confirm details"
              >
                <StepReviewCustomerDetails />
              </Stepper.Step>
            </Stepper>
            <Group justify="space-between" mt="xl">
              {activeStep > 0 && (
                <Button variant="default" onClick={prevStep}>
                  Back
                </Button>
              )}
              {activeStep < 2 && <Button onClick={nextStep}>Next</Button>}
              {activeStep === 2 && (
                <Button type="submit" loading={methods.formState.isSubmitting}>
                  Submit
                </Button>
              )}
            </Group>
          </form>
        </Box>
      </FormProvider>
    </>
  );
};

export default CreateCustomers;

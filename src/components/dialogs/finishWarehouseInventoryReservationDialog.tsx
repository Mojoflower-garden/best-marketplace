"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CreditActionEnum, IReservation } from "~/utils/icrTypes";
import { api } from "~/utils/api";

const formSchema = z
  .object({
    receiverId: z
      .string()
      .min(32, {
        message: "Organization ids must be at least 32 characters.",
      })
      .optional(),
    action: z.nativeEnum(CreditActionEnum),
    retirementData: z
      .object({
        reason: z.string(),
        beneficiaryName: z.string(),
        comment: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => data.action === CreditActionEnum.transfer || data.retirementData,
    {
      message: "Role field is required when subject equals 1",
      path: ["role"], // Pointing out which field is invalid
    },
  );

export const FinishWarehouseReservationDialog = ({
  trigger,
  variant = "default",
  credit,
  organizationId,
}: {
  trigger: unknown;
  variant?: "destructive" | "default";
  description?: string;
  credit: IReservation;
  organizationId: string;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: CreditActionEnum.transfer,
    },
  });
  const {
    mutateAsync: finishReservation,
    isLoading: isLoadingFinishReservation,
  } = api.icr.finishReservation.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await finishReservation({
      action: values.action,
      organizationId: organizationId,
      reservationId: credit.id,
      retirementData: values.retirementData,
      receiverId: values.receiverId ?? "",
    });
    setOpen(false);
  }

  const { action } = form.watch();
  return (
    <Dialog open={open} onOpenChange={(newOpen: boolean) => setOpen(newOpen)}>
      <DialogTrigger asChild>{trigger ?? "Open"}</DialogTrigger>
      <DialogContent className="max-h-screen max-w-lg overflow-y-scroll">
        <DialogTitle>Request credit action</DialogTitle>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Action type</FormLabel>
                  <FormControl className="">
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === CreditActionEnum.transfer)
                          form.setValue("retirementData", undefined);
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={CreditActionEnum.transfer} />
                        </FormControl>
                        <FormLabel className="font-normal">Transfer</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={CreditActionEnum.transfer_retire}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Transfer and retire
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To organizationId</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="5d2611cf-6deb-483f-b7d2-f2b61e1d8bee"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {action !== CreditActionEnum.transfer && (
              <div>
                <FormField
                  control={form.control}
                  name="retirementData.beneficiaryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beneficiary</FormLabel>
                      <FormControl>
                        <Input placeholder="Tesla inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retirementData.reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="Tesla inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retirementData.comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment - OPTIONAL</FormLabel>
                      <FormControl>
                        <Input placeholder="Tesla inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant={"outline"}
                className="mr-3"
                disabled={isLoadingFinishReservation}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoadingFinishReservation}
                disabled={isLoadingFinishReservation}
                variant={variant === "destructive" ? "destructive" : "default"}
              >
                Accept
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

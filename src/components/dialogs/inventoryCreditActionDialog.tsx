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
import { CreditActionEnum, ICredit } from "~/utils/icrTypes";
import { api } from "~/utils/api";

const formSchema = z
  .object({
    organizationId: z
      .string()
      .min(32, {
        message: "Organization Ids must be at least 323 characters.",
      })
      .optional(),
    toAddress: z.string().optional(),
    action: z.nativeEnum(CreditActionEnum),
    amount: z.number().gt(0),
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

export const InventoryCreditActionDialog = ({
  trigger,
  variant = "default",
  credit,
}: {
  trigger: unknown;
  variant?: "destructive" | "default";
  description?: string;
  credit: ICredit;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: CreditActionEnum.transfer,
    },
  });
  const {
    mutateAsync: createActionRequest,
    isLoading: isLoadingCreatingActionRequest,
  } = api.icr.requestCreditAction.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createActionRequest({
      ...values,
      creditId: credit.id,
      toOrganizationId: values.organizationId,
      organizationId: credit.organizationId,
    });
    setOpen(false);
  }

  const { action } = form.watch();
  console.log("ERRORS:", form.formState.errors);
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
                          <RadioGroupItem value={CreditActionEnum.retire} />
                        </FormControl>
                        <FormLabel className="font-normal">Retire</FormLabel>
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
              name="organizationId"
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
            <FormField
              control={form.control}
              name="toAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        form.setValue(
                          "amount",
                          isNaN(parseFloat(e.target.value))
                            ? 0
                            : parseFloat(e.target.value),
                        );
                      }}
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
                disabled={isLoadingCreatingActionRequest}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoadingCreatingActionRequest}
                disabled={isLoadingCreatingActionRequest}
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

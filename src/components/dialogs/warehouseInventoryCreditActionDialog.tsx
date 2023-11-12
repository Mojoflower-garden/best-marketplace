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
import { ICredit } from "~/utils/icrTypes";
import { api } from "~/utils/api";

const formSchema = z.object({
  amount: z.number().gt(0),
});

export const WarehouseInventoryCreditActionDialog = ({
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
    defaultValues: {},
  });
  const { mutateAsync: resreveCredits, isLoading: isLoadingReserveCredits } =
    api.icr.reserveWarehouseCreditAction.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    await resreveCredits({
      amount: values.amount,
      creditId: credit.id,
      organizationId: credit.organizationId,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen: boolean) => setOpen(newOpen)}>
      <DialogTrigger asChild>{trigger ?? "Open"}</DialogTrigger>
      <DialogContent className="max-h-screen max-w-lg overflow-y-scroll">
        <DialogTitle>Reserve warehouse credit action</DialogTitle>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant={"outline"}
                className="mr-3"
                disabled={isLoadingReserveCredits}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoadingReserveCredits}
                disabled={isLoadingReserveCredits}
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

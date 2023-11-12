"use client";
import { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import { organization_type } from "~/utils/icrTypes";

const formSchema = z.object({
  user: z.object({
    email: z.string(),
    fullName: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
  organization: z.object({
    fullName: z.string(),
    type: z.nativeEnum(organization_type),
    countryCode: z.string().optional(),
  }),
});

export const CreateUserOrgAccountOnICRDialog = ({
  trigger,
  variant = "default",
}: {
  trigger: unknown;
  variant?: "destructive" | "default";
  description?: string;
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { mutateAsync: create, isLoading: isLoadingCreate } =
    api.icr.createICRUserAndOrganization.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const res = await create(values);
    router.push(`/finishIntegration?installationId=${res.installation.id}`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen: boolean) => setOpen(newOpen)}>
      <DialogTrigger asChild>{trigger ?? "Open"}</DialogTrigger>
      <DialogContent className="max-h-screen max-w-lg overflow-y-scroll">
        <DialogTitle>Create ICR user and organization</DialogTitle>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="mb-4">
              <div>User info</div>
              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <Input placeholder="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <div>Org info</div>
              <FormField
                control={form.control}
                name="organization.type"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Org type</FormLabel>
                    <FormControl className="">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={organization_type.marketParticipant}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Market participant
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={organization_type.other} />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={organization_type.projectDeveloper}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Project developer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={organization_type.projectProponent}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Project proponent
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={organization_type.validationBody}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Validation body
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
                name="organization.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Org name</FormLabel>
                    <FormControl>
                      <Input placeholder="My organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant={"outline"}
                className="mr-3"
                disabled={isLoadingCreate}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoadingCreate}
                disabled={isLoadingCreate}
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

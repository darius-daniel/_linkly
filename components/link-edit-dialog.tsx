import { Link } from "@/app/generated/prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SidebarMenuButton } from "./ui/sidebar";
import { CircleCheck, CirclePlusIcon, CircleX } from "lucide-react";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Text } from "@radix-ui/themes";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { dashboardQueryClient } from "@/app/dashboard/layout";
import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import { createLink } from "@/lib/actions/link";

export default function LinkEditDialog({ link }: { link: Link }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createLink, {
    errors: {},
  });

  useEffect(() => {
    if (state?.message) {
      const hasErrors = state.errors && Object.keys(state.errors).length > 0;

      if (!hasErrors) {
        setOpen(false);
        // Invalidate to refetch fresh data from the server
        dashboardQueryClient.invalidateQueries({ queryKey: ["links"] });
        toast.success(state.message, {
          icon: <CircleCheck color="green" />,
        });
      } else {
        toast.error(state.message, {
          icon: <CircleX color="red" />,
        });
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="border border-primary">
        <SidebarMenuButton className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <CirclePlusIcon />
          <span>Quick Create</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create new short link</DialogTitle>
            <DialogDescription>
              Enter the URL you want to shorten. If you don't provide a custom
              slug, one will be generated for you.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="min-h-48 pt-2">
            <Field>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com"
                className={state.errors?.url ? "border-red-500" : ""}
              />
              {state.errors?.url?.map((error) => (
                <Text color="red" key={error}>
                  {error}
                </Text>
              ))}
            </Field>
            <Field>
              <Label htmlFor="slug">Custom slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="example"
                className={state.errors?.slug ? "border-red-500" : ""}
              />
              {state.errors?.slug?.map((error) => (
                <Text color="red" key={error}>
                  {error}
                </Text>
              ))}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{pending ? <Spinner /> : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

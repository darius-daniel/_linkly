"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CircleCheck, CirclePlusIcon, CircleX } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { useActionState, useEffect, useState } from "react";
import { createLink } from "@/lib/actions/link";
import { Spinner } from "./ui/spinner";
import { Text } from "@radix-ui/themes";
import { toast } from "sonner";

export default function QuickCreateDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createLink, {
    errors: {},
  });

  useEffect(() => {
    if (state?.message) {
      const hasErrors = state.errors && Object.keys(state.errors).length > 0;

      if (!hasErrors) {
        setOpen(false); // Close dialog on success
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

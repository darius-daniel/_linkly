"use client";

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
import { CircleCheck, CircleX } from "lucide-react";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Text } from "@radix-ui/themes";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { dashboardQueryClient } from "@/app/dashboard/layout";
import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import { updateLink } from "@/lib/actions/link";
import LinkEditButton from "./link-edit-btn";

export default function LinkEditDialog({
  link,
  trigger,
}: {
  link: Link;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateLink, {
    errors: {},
  });

  useEffect(() => {
    if (state?.message) {
      const hasErrors = state.errors && Object.keys(state.errors).length > 0;

      if (!hasErrors) {
        setOpen(false);
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

  // Format datetime for input (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <LinkEditButton />}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction}>
          <input type="hidden" name="id" value={link.id} />
          <DialogHeader>
            <DialogTitle>Edit short link</DialogTitle>
            <DialogDescription>
              Update your link details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4 py-4">
            <Field>
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                name="title"
                defaultValue={link.title || ""}
                placeholder="My awesome link"
                className={state.errors?.title ? "border-red-500" : ""}
              />
              {state.errors?.title?.map((error) => (
                <Text color="red" key={error} size="1">
                  {error}
                </Text>
              ))}
            </Field>
            <Field>
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                name="url"
                defaultValue={link.url}
                placeholder="https://example.com"
                className={state.errors?.url ? "border-red-500" : ""}
              />
              {state.errors?.url?.map((error) => (
                <Text color="red" key={error} size="1">
                  {error}
                </Text>
              ))}
            </Field>
            <Field>
              <Label htmlFor="slug">Custom slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={link.slug}
                placeholder="my-link"
                className={state.errors?.slug ? "border-red-500" : ""}
              />
              {state.errors?.slug?.map((error) => (
                <Text color="red" key={error} size="1">
                  {error}
                </Text>
              ))}
            </Field>
            <Field>
              <Label htmlFor="expiresAt">Expires at (optional)</Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                defaultValue={formatDateTimeLocal(link.expiresAt)}
                className={state.errors?.expiresAt ? "border-red-500" : ""}
              />
              {state.errors?.expiresAt?.map((error) => (
                <Text color="red" key={error} size="1">
                  {error}
                </Text>
              ))}
              <Text color="gray" size="1">
                Leave empty for no expiration
              </Text>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                pending ||
                (link.expiresAt && new Date(link.expiresAt) < new Date()) ||
                true
              }
            >
              {pending ? <Spinner /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

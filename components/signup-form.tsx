"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { CircleCheckIcon, CircleXIcon, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(
    null,
  );

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const { data, error } = await authClient.signUp.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
        callbackURL: "/dashboard",
      },
      {
        onRequest: (ctx) => {
          setLoadingToastId(toast.loading("Signing up..."));
        },
        onSuccess: (ctx) => {
          toast.dismiss(loadingToastId as string | number);
          toast.success("Signed up successfully", {
            icon: <CircleCheckIcon className="size-4" />,
          });
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId as string | number);
          toast.error(ctx.error.message, {
            icon: <CircleXIcon className="size-4" />,
          });
        },
      },
    );
  };

  return (
    <Card {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-2 font-medium p-2 rounded-lg hover:bg-primary/20 transition-all duration-150"
        >
          <div className="flex size-8 items-center justify-center">
            <LinkIcon className="size-6" color="var(--primary)" />
          </div>
          <span className="sr-only">Linkly</span>
        </Link>
        <h1 className="text-xl font-bold">Welcome to Linkly</h1>
      </div>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription className="text-xs">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription className="text-xs">
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
            </Field>
            <FieldDescription className="text-xs">
              Must be at least 8 characters long.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

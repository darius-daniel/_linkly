"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Card {...props}>
      <div className="flex flex-col items-center gap-4 text-center">
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

      <CardContent>
        <div>
          <FieldGroup>
            <Field className="gap-6">
              <Button
                variant="outline"
                type="button"
                onClick={handleSignInWithGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign up with Google
              </Button>
              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </div>
      </CardContent>
    </Card>
  );
}

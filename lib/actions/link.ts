"use server";

import z from "zod";
import prisma from "../db/client";

export type FormState = {
  message?: string;
  errors?: {
    url?: string[];
    slug?: string[];
  };
  data?: {
    url: string;
    slug: string;
    id: string;
    title: string | null;
    user_id: string | null;
    clicks: number;
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
  };
};

const linkCreationSchema = z.object({
  url: z.string().url("Please enter a valid URL").trim(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
    .optional()
    .or(z.literal("")),
});

export async function createLink(
  initialState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = linkCreationSchema.safeParse({
    url: formData.get("url"),
    slug: formData.get("slug"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { url, slug } = validatedFields.data;
    const newLink = await prisma.link.create({
      data: { url, slug: slug || undefined },
    });

    return {
      data: newLink,
      message: "Success",
    };
  } catch {
    return {
      message: "Failed",
    };
  }
}

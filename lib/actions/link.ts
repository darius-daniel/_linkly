"use server";

import z from "zod";
import prisma from "../db/client";

export type FormState = {
  message?: string;
  errors?: {
    url?: string[];
    slug?: string[];
    title?: string[];
    expiresAt?: string[];
  };
  data?: {
    url: string;
    slug: string;
    id: string;
    title: string | null;
    userID: string | null;
    clicks: number;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
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

const linkUpdateSchema = z.object({
  id: z.string(),
  title: z.string().trim().optional().or(z.literal("")),
  url: z.string().url("Please enter a valid URL").trim(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  expiresAt: z.string().optional().or(z.literal("")),
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

export async function updateLink(
  initialState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = linkUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    url: formData.get("url"),
    slug: formData.get("slug"),
    expiresAt: formData.get("expiresAt"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, title, url, slug, expiresAt } = validatedFields.data;

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title: title || null,
        url,
        slug,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return {
      data: updatedLink,
      message: "Link updated successfully",
    };
  } catch (error) {
    return {
      message: "Failed to update link",
    };
  }
}

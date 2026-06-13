import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db/client";
import { sendEmail, createEmailSender } from "@better-auth/infra";

export const auth = betterAuth({
  session: {
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact", // or "jwt" or "jwe"
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    requireEmail: true,
    requireEmailVerification: true,
    requirePassword: true,
    requirePasswordConfirmation: true,
    enforceStrongPassword: true,
    passwordPolicy: {
      minLength: 8,
      maxLength: 64,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        template: "verify-email",
        variables: {
          verificationUrl: url,
          verificationCode: token,
          userEmail: user.email,
        },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function VerifyEmail() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Verify Your Email</EmptyTitle>
        <EmptyDescription>
          Check your email inbox and verify your email address to access your
          account.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

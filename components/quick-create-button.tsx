import { CirclePlusIcon } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { forwardRef } from "react";

const QuickCreateButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SidebarMenuButton>
>((props, ref) => {
  return (
    <SidebarMenuButton
      ref={ref}
      {...props}
      className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
    >
      <CirclePlusIcon />
      <span>Quick Create</span>
    </SidebarMenuButton>
  );
});

QuickCreateButton.displayName = "QuickCreateButton";

export default QuickCreateButton;

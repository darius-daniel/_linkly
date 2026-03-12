import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { forwardRef } from "react";

const LinkCreateButton = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <Button variant="ghost" size="sm" {...props} ref={ref}>
      <PlusIcon />
      <span className="hidden lg:inline">Create Link</span>
    </Button>
  );
});

LinkCreateButton.displayName = "LinkCreateButton";

export default LinkCreateButton;

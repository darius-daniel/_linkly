import { PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { forwardRef } from "react";

const LinkEditButton = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <Button variant="ghost" size="sm" {...props} ref={ref}>
      <PencilIcon />
      <span className="hidden lg:inline">Edit</span>
    </Button>
  );
});

LinkEditButton.displayName = "LinkEditButton";

export default LinkEditButton;

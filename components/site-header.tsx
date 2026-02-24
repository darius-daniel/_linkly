import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Flex } from "@radix-ui/themes";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <Flex
      gap="8px"
      align="center"
      flexShrink="0"
      className="h-(--header-height) border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <Flex
        gap={{ initial: "4px", lg: "8px" }}
        p={{ initial: "16px", lg: "24px" }}
        align="center"
        width="100%"
      >
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-base font-medium mr-auto">Dashboard</h1>
        <ThemeToggle />
      </Flex>
    </Flex>
  );
}

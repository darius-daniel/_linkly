import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import { Metadata } from "next";
import { Flex } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Linkly | Dashboard",
  description: "Shorten your long links",
};

export default function Page() {
  return (
    <Flex direction="row">
      <Flex
        flexGrow="1"
        gap="8px"
        direction="column"
        display="inline-flex"
        className="@container/main"
      >
        <Flex
          direction="column"
          gap={{ initial: "16px", lg: "24px" }}
          py={{ initial: "16px", lg: "24px" }}
        >
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </Flex>
      </Flex>
    </Flex>
  );
}

"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import { Flex } from "@radix-ui/themes";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["links"],
    queryFn: () =>
      axiosInstance.get("/links").then((res: AxiosResponse) => res.data.links),
  });

  return isLoading ? (
    <Skeleton className="w-full h-full grid place-items-center">
      <Spinner />
    </Skeleton>
  ) : (
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
          <SectionCards links={data ?? []} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data ?? []} />
        </Flex>
      </Flex>
    </Flex>
  );
}

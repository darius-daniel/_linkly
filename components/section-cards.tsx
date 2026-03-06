"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Link } from "@/app/generated/prisma/client";

export function SectionCards({ links }: { links: Array<Link> }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Links</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {links.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon color="green" />
              {links.filter((link) => link.created_at > new Date()).length}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing steadily <TrendingUpIcon className="size-4" color="green" />
          </div>
          <div className="text-muted-foreground">
            Links created in the last 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Clicks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {links.reduce((acc, link) => acc + link.clicks, 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon color="green" />
              +11.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Up this month <TrendingUpIcon className="size-4" color="green" />
          </div>
          <div className="text-muted-foreground">
            Across all shortened links
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Click-Through Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3.8%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon color="red" />
              -0.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Slight dip this week{" "}
            <TrendingDownIcon color="red" className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Average across active links
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Links</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {
              links.filter(
                (link) =>
                  !link?.expires_at || new Date(link?.expires_at) > new Date(),
              ).length
            }
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon color="green" />
              +6.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong engagement{" "}
            <TrendingUpIcon className="size-4" color="green" />
          </div>
          <div className="text-muted-foreground">
            Links with at least 1 click this month
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

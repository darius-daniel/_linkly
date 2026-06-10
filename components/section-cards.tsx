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
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  type ClickMetrics,
  formatCtrPercent,
  formatCtrPeriodChange,
  formatPeriodChangePercent,
  isPeriodGrowing,
} from "@/lib/stats/click-metrics";

export function SectionCards({ links }: { links: Array<Link> }) {
  const { data: metrics } = useQuery<{ metrics: ClickMetrics }>({
    queryKey: ["dashboard-metrics"],
    queryFn: () =>
      axiosInstance.get("/dashboard/metrics").then((res) => res.data),
  });

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Total Links: this month vs last month
  const thisMonthLinks = links.filter(
    (l) => new Date(l.createdAt) >= startOfThisMonth,
  ).length;
  const lastMonthLinks = links.filter((l) => {
    const d = new Date(l.createdAt);
    return d >= startOfLastMonth && d < startOfThisMonth;
  }).length;

  // Active Links: non-expired, this month vs last month
  const activeLinks = links.filter(
    (l) => !l.expiresAt || new Date(l.expiresAt) > now,
  );
  const thisMonthActive = activeLinks.filter(
    (l) => new Date(l.createdAt) >= startOfThisMonth,
  ).length;
  const lastMonthActive = activeLinks.filter((l) => {
    const d = new Date(l.createdAt);
    return d >= startOfLastMonth && d < startOfThisMonth;
  }).length;

  const linksTrending = isPeriodGrowing(thisMonthLinks, lastMonthLinks);
  const activeTrending = isPeriodGrowing(thisMonthActive, lastMonthActive);
  const clickMetrics = metrics?.metrics;
  const clicksTrending = clickMetrics
    ? isPeriodGrowing(
        clickMetrics.thisMonthClicks,
        clickMetrics.lastMonthClicks,
      )
    : true;
  const ctrTrending = clickMetrics
    ? isPeriodGrowing(clickMetrics.thisMonthCtr, clickMetrics.lastMonthCtr)
    : false;

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
              {linksTrending ? (
                <TrendingUpIcon color="green" />
              ) : (
                <TrendingDownIcon color="red" />
              )}
              {formatPeriodChangePercent(thisMonthLinks, lastMonthLinks)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 texrrt-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {linksTrending ? "Growing steadily" : "Slowing down"}{" "}
            {linksTrending ? (
              <TrendingUpIcon className="size-4" color="green" />
            ) : (
              <TrendingDownIcon className="size-4" color="red" />
            )}
          </div>
          <div className="text-muted-foreground">
            Links created this month vs last month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Clicks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {clickMetrics?.totalClicks ??
              links.reduce((acc, link) => acc + link.clicks, 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {clicksTrending ? (
                <TrendingUpIcon color="green" />
              ) : (
                <TrendingDownIcon color="red" />
              )}
              {clickMetrics
                ? formatPeriodChangePercent(
                    clickMetrics.thisMonthClicks,
                    clickMetrics.lastMonthClicks,
                  )
                : "—"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {clicksTrending ? "Up this month" : "Down this month"}{" "}
            {clicksTrending ? (
              <TrendingUpIcon className="size-4" color="green" />
            ) : (
              <TrendingDownIcon className="size-4" color="red" />
            )}
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
            {clickMetrics
              ? formatCtrPercent(clickMetrics.clickThroughRate)
              : "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {ctrTrending ? (
                <TrendingUpIcon color="green" />
              ) : (
                <TrendingDownIcon color="red" />
              )}
              {clickMetrics
                ? formatCtrPeriodChange(
                    clickMetrics.thisMonthCtr,
                    clickMetrics.lastMonthCtr,
                  )
                : "—"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {ctrTrending ? "Improving this month" : "Slight dip this month"}{" "}
            {ctrTrending ? (
              <TrendingUpIcon color="green" className="size-4" />
            ) : (
              <TrendingDownIcon color="red" className="size-4" />
            )}
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
            {activeLinks.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {activeTrending ? (
                <TrendingUpIcon color="green" />
              ) : (
                <TrendingDownIcon color="red" />
              )}
              {formatPeriodChangePercent(thisMonthActive, lastMonthActive)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeTrending ? "Strong engagement" : "Engagement dropping"}{" "}
            {activeTrending ? (
              <TrendingUpIcon className="size-4" color="green" />
            ) : (
              <TrendingDownIcon className="size-4" color="red" />
            )}
          </div>
          <div className="text-muted-foreground">
            Links with at least 1 click this month
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

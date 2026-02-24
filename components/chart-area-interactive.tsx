"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Clicks over time";

const chartData = [
  { date: "2024-04-01", clicks: 142, unique: 98 },
  { date: "2024-04-02", clicks: 87, unique: 61 },
  { date: "2024-04-03", clicks: 203, unique: 140 },
  { date: "2024-04-04", clicks: 312, unique: 210 },
  { date: "2024-04-05", clicks: 278, unique: 195 },
  { date: "2024-04-06", clicks: 189, unique: 131 },
  { date: "2024-04-07", clicks: 95, unique: 72 },
  { date: "2024-04-08", clicks: 340, unique: 230 },
  { date: "2024-04-09", clicks: 121, unique: 88 },
  { date: "2024-04-10", clicks: 267, unique: 184 },
  { date: "2024-04-11", clicks: 398, unique: 271 },
  { date: "2024-04-12", clicks: 215, unique: 150 },
  { date: "2024-04-13", clicks: 302, unique: 208 },
  { date: "2024-04-14", clicks: 174, unique: 122 },
  { date: "2024-04-15", clicks: 231, unique: 160 },
  { date: "2024-04-16", clicks: 188, unique: 130 },
  { date: "2024-04-17", clicks: 421, unique: 289 },
  { date: "2024-04-18", clicks: 364, unique: 250 },
  { date: "2024-04-19", clicks: 199, unique: 138 },
  { date: "2024-04-20", clicks: 112, unique: 79 },
  { date: "2024-04-21", clicks: 156, unique: 108 },
  { date: "2024-04-22", clicks: 243, unique: 168 },
  { date: "2024-04-23", clicks: 178, unique: 123 },
  { date: "2024-04-24", clicks: 387, unique: 265 },
  { date: "2024-04-25", clicks: 295, unique: 204 },
  { date: "2024-04-26", clicks: 134, unique: 93 },
  { date: "2024-04-27", clicks: 412, unique: 283 },
  { date: "2024-04-28", clicks: 165, unique: 115 },
  { date: "2024-04-29", clicks: 319, unique: 220 },
  { date: "2024-04-30", clicks: 451, unique: 309 },
  { date: "2024-05-01", clicks: 194, unique: 135 },
  { date: "2024-05-02", clicks: 308, unique: 212 },
  { date: "2024-05-03", clicks: 267, unique: 184 },
  { date: "2024-05-04", clicks: 390, unique: 268 },
  { date: "2024-05-05", clicks: 481, unique: 330 },
  { date: "2024-05-06", clicks: 520, unique: 357 },
  { date: "2024-05-07", clicks: 355, unique: 244 },
  { date: "2024-05-08", clicks: 148, unique: 103 },
  { date: "2024-05-09", clicks: 213, unique: 148 },
  { date: "2024-05-10", clicks: 329, unique: 226 },
  { date: "2024-05-11", clicks: 274, unique: 189 },
  { date: "2024-05-12", clicks: 197, unique: 137 },
  { date: "2024-05-13", clicks: 162, unique: 113 },
  { date: "2024-05-14", clicks: 445, unique: 305 },
  { date: "2024-05-15", clicks: 380, unique: 261 },
  { date: "2024-05-16", clicks: 338, unique: 232 },
  { date: "2024-05-17", clicks: 499, unique: 342 },
  { date: "2024-05-18", clicks: 315, unique: 217 },
  { date: "2024-05-19", clicks: 235, unique: 162 },
  { date: "2024-05-20", clicks: 177, unique: 123 },
  { date: "2024-05-21", clicks: 143, unique: 99 },
  { date: "2024-05-22", clicks: 121, unique: 84 },
  { date: "2024-05-23", clicks: 289, unique: 199 },
  { date: "2024-05-24", clicks: 314, unique: 216 },
  { date: "2024-05-25", clicks: 251, unique: 173 },
  { date: "2024-05-26", clicks: 213, unique: 148 },
  { date: "2024-05-27", clicks: 420, unique: 288 },
  { date: "2024-05-28", clicks: 233, unique: 161 },
  { date: "2024-05-29", clicks: 131, unique: 91 },
  { date: "2024-05-30", clicks: 340, unique: 234 },
  { date: "2024-05-31", clicks: 178, unique: 124 },
  { date: "2024-06-01", clicks: 198, unique: 137 },
  { date: "2024-06-02", clicks: 471, unique: 323 },
  { date: "2024-06-03", clicks: 163, unique: 113 },
  { date: "2024-06-04", clicks: 439, unique: 301 },
  { date: "2024-06-05", clicks: 128, unique: 89 },
  { date: "2024-06-06", clicks: 294, unique: 202 },
  { date: "2024-06-07", clicks: 323, unique: 222 },
  { date: "2024-06-08", clicks: 385, unique: 264 },
  { date: "2024-06-09", clicks: 441, unique: 302 },
  { date: "2024-06-10", clicks: 155, unique: 108 },
  { date: "2024-06-11", clicks: 142, unique: 99 },
  { date: "2024-06-12", clicks: 492, unique: 337 },
  { date: "2024-06-13", clicks: 131, unique: 91 },
  { date: "2024-06-14", clicks: 426, unique: 292 },
  { date: "2024-06-15", clicks: 307, unique: 211 },
  { date: "2024-06-16", clicks: 371, unique: 254 },
  { date: "2024-06-17", clicks: 475, unique: 325 },
  { date: "2024-06-18", clicks: 167, unique: 116 },
  { date: "2024-06-19", clicks: 341, unique: 234 },
  { date: "2024-06-20", clicks: 408, unique: 280 },
  { date: "2024-06-21", clicks: 219, unique: 151 },
  { date: "2024-06-22", clicks: 317, unique: 218 },
  { date: "2024-06-23", clicks: 480, unique: 329 },
  { date: "2024-06-24", clicks: 182, unique: 126 },
  { date: "2024-06-25", clicks: 191, unique: 132 },
  { date: "2024-06-26", clicks: 434, unique: 298 },
  { date: "2024-06-27", clicks: 448, unique: 307 },
  { date: "2024-06-28", clicks: 199, unique: 138 },
  { date: "2024-06-29", clicks: 153, unique: 106 },
  { date: "2024-06-30", clicks: 446, unique: 306 },
];

const chartConfig = {
  clicks: {
    label: "Total Clicks",
    color: "var(--primary)",
  },
  unique: {
    label: "Unique Visitors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Clicks Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total and unique clicks across all links
          </span>
          <span className="@[540px]/card:hidden">
            Clicks &amp; unique visitors
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clicks)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-unique)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-unique)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="unique"
              type="natural"
              fill="url(#fillUnique)"
              stroke="var(--color-unique)"
              stackId="a"
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="url(#fillClicks)"
              stroke="var(--color-clicks)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

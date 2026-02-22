"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { OrderStatusData } from "@/lib/data";

const chartConfig = {
  count: { label: "Orders" },
  Complete: { label: "Complete", color: "var(--chart-1)" },
  Shipped: { label: "Shipped", color: "var(--chart-2)" },
  Processing: { label: "Processing", color: "var(--chart-3)" },
  Cancelled: { label: "Cancelled", color: "var(--chart-4)" },
  Returned: { label: "Returned", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ChartOrderStatus({ data }: { data: OrderStatusData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution of order statuses</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

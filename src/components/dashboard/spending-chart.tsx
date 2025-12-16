
"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transaction, Category } from "@/lib/types";
import { TrendingUp } from "lucide-react";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SpendingChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expenseData = React.useMemo(() => {
    return transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.total += transaction.amount;
      } else {
        acc.push({ name: category, total: transaction.amount });
      }
      return acc;
    }, [] as { name: Category; total: number }[]);
  }, [transactions]);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
        <CardDescription>
          Your spending breakdown for this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip
                contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                }}
                />
                <Pie
                data={expenseData}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                labelLine={false}
                label={renderCustomizedLabel}
                >
                {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <TrendingUp className="w-16 h-16 mb-4 text-primary/20" />
                <h3 className="text-lg font-semibold">No Spending Data</h3>
                <p>Add some expense transactions to see your spending chart.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

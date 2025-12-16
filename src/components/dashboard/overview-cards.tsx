
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { IndianRupee, TrendingUp, TrendingDown } from "lucide-react";

export function OverviewCards({ transactions }: { transactions: Transaction[]}) {
  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;

  const cards = [
    {
      title: "Total Income (This Month)",
      amount: totalIncome,
      icon: TrendingUp,
      change: "+₹0 from last month",
      changeColor: "text-green-600",
    },
    {
      title: "Total Expenses (This Month)",
      amount: totalExpenses,
      icon: TrendingDown,
      change: "+₹0 from last month",
      changeColor: "text-red-600",
    },
     {
      title: "Net Income (This Month)",
      amount: netIncome,
      icon: IndianRupee,
      change: netIncome >= 0 ? 'You are in the green!' : 'You are in the red!',
      changeColor: netIncome >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.amount)}</div>
            {card.change && (
              <p className={`text-xs ${card.changeColor || 'text-muted-foreground'}`}>{card.change}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

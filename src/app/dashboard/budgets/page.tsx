
"use client";

import * as React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Budget, Transaction } from "@/lib/types";
import { AddBudget } from "@/components/dashboard/add-budget";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoryInfo } from "@/lib/data";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetsPage() {
  const user = useUser();
  const { data: budgets, loading: budgetsLoading } = useCollection<Budget>(`users/${user?.uid}/budgets`);
  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);

  const monthlyTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === new Date().getMonth() && transactionDate.getFullYear() === new Date().getFullYear();
    });
  }, [transactions]);

  const addBudget = async (budget: Omit<Budget, "id">) => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/budgets`), budget);
    }
  };
  
  const getSpentAmount = (category: string) => {
    return monthlyTransactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress > 90) return "bg-destructive";
    if (progress > 75) return "bg-yellow-500";
    return "bg-primary";
  }

  const loading = budgetsLoading || transactionsLoading;

  if (loading) {
     return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
            </div>
        </div>
     )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Monthly Budgets</h1>
            <p className="text-muted-foreground">Manage your spending limits for each category.</p>
        </div>
        <AddBudget addBudget={addBudget} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const spent = getSpentAmount(budget.category);
          const remaining = budget.total - spent;
          const progress = Math.min((spent / budget.total) * 100, 100);
          const Icon = categoryInfo[budget.category]?.icon;
          
          return (
            <Card key={budget.id} className="flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                 {Icon && <div className="p-2 bg-muted rounded-full"><Icon className="h-5 w-5 text-muted-foreground" /></div>}
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                </div>
                 <p className={`text-sm font-semibold ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {formatCurrency(remaining)} left
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <Progress value={progress} indicatorClassName={getProgressColor(progress)} />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(spent)} of {formatCurrency(budget.total)}
                </p>
              </CardFooter>
            </Card>
          );
        })}
         {budgets.length === 0 && !loading && (
          <Card className="md:col-span-2 lg:col-span-3">
             <CardContent className="p-6 text-center">
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                    <PiggyBank className="w-16 h-16 mb-4 text-primary/20" />
                    <h3 className="text-lg font-semibold mb-2">No Budgets Created Yet</h3>
                    <p className="mb-4">Create budgets for different spending categories to stay on track.</p>
                    <AddBudget addBudget={addBudget}>
                        <Button>Create Your First Budget</Button>
                    </AddBudget>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

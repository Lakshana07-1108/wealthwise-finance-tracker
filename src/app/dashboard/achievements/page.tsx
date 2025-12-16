
"use client";

import * as React from "react";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Transaction, Budget, Bill, Category } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Award, TrendingUp, ShieldCheck, Badge as BadgeIcon, ScanLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const allCategories: Category[] = ["Food", "Travel", "Bills", "Shopping", "Health"];

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: (data: { transactions: Transaction[]; budgets: Budget[]; bills: Bill[] }) => boolean;
};

const achievements: Achievement[] = [
  {
    id: "first-budget",
    name: "Budget Beginner",
    description: "Create your first budget to start tracking your spending.",
    icon: Star,
    isUnlocked: ({ budgets }) => budgets.length > 0,
  },
  {
    id: "ten-transactions",
    name: "Transaction Titan",
    description: "Manually add at least 10 transactions.",
    icon: Award,
    isUnlocked: ({ transactions }) => transactions.length >= 10,
  },
  {
    id: "savvy-saver",
    name: "Savvy Saver",
    description: "Achieve a positive net balance for the current month.",
    icon: TrendingUp,
    isUnlocked: ({ transactions }) => {
      const now = new Date();
      const currentMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === now.getFullYear() && tDate.getMonth() === now.getMonth();
      });
      const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return income > expense;
    },
  },
  {
    id: 'bill-buster',
    name: 'Bill Buster',
    description: 'Add and track at least 5 bills.',
    icon: ShieldCheck,
    isUnlocked: ({ bills }) => bills.length >= 5,
  },
  {
    id: 'category-king',
    name: 'Category King',
    description: 'Use all available spending categories.',
    icon: Trophy,
    isUnlocked: ({ transactions }) => {
        const usedCategories = new Set(transactions.map(t => t.category));
        return allCategories.every(cat => usedCategories.has(cat));
    }
  },
  {
    id: 'receipt-scanner',
    name: 'Receipt Scanner',
    description: 'Scan your first receipt.',
    icon: ScanLine,
    isUnlocked: ({ transactions }) => {
        return transactions.some(t => t.source === 'scan');
    }
  }
];

export default function AchievementsPage() {
  const user = useUser();
  const { data: transactions, loading: tLoading } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : '');
  const { data: budgets, loading: bLoading } = useCollection<Budget>(user ? `users/${user.uid}/budgets` : '');
  const { data: bills, loading: billLoading } = useCollection<Bill>(user ? `users/${user.uid}/bills` : '');
  
  const loading = tLoading || bLoading || billLoading;

  const unlockedAchievements = React.useMemo(() => {
    if (loading) return [];
    return achievements.filter(a => a.isUnlocked({ transactions, budgets, bills }));
  }, [transactions, budgets, bills, loading]);
  
  const unlockedCount = unlockedAchievements.length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;


  if (loading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-28" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock badges for your financial discipline.
        </p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>You've unlocked {unlockedCount} of {achievements.length} achievements.</CardDescription>
          </CardHeader>
          <CardContent>
              <Progress value={progressPercentage} className="h-3" />
          </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === achievement.id);
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className={`transition-all duration-300 transform hover:-translate-y-1 ${isUnlocked ? 'border-primary border-2 shadow-lg' : 'bg-muted/30'}`}>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                 <div className={`relative p-4 rounded-full ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                    {isUnlocked && <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>}
                    <Icon className={`h-8 w-8 relative ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                 </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                 <Badge variant={isUnlocked ? 'default' : 'secondary'} className="mt-auto">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


"use client";

import * as React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import AiInsights from "@/components/dashboard/ai-insights";
import type { Transaction, Bill } from "@/lib/types";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import UpcomingBills from "@/components/dashboard/upcoming-bills";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const user = useUser();
  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : '');
  const { data: bills, loading: billsLoading } = useCollection<Bill>(user ? `users/${user.uid}/bills` : '');
  
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
    }
  };

  const loading = transactionsLoading || billsLoading;

  if(loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Skeleton className="xl:col-span-2 h-[400px]" />
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-[250px]" />
                  <Skeleton className="h-[250px]" />
                </div>
            </div>
            <Skeleton className="h-96" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCards transactions={transactions} />
      </div>
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SpendingChart transactions={transactions} />
        </div>
        <div className="flex flex-col gap-6">
          <AiInsights transactions={transactions} />
          <UpcomingBills bills={bills} />
        </div>
      </div>
       <RecentTransactions
        transactions={transactions}
        addTransaction={addTransaction}
        showViewAll={true}
      />
    </div>
  );
}

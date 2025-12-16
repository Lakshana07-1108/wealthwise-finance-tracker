
"use client";

import * as React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/lib/types";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsPage() {
  const user = useUser();
  const { data: transactions, loading } = useCollection<Transaction>(user ? `users/${user.uid}/transactions` : '');

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  if(loading) {
    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">All Transactions</h1>
            <p className="text-muted-foreground">A complete history of your income and expenses.</p>
        </div>
      </div>
      <RecentTransactions
        transactions={sortedTransactions}
        addTransaction={addTransaction}
      />
    </div>
  );
}

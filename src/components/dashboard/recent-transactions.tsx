
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { categoryInfo } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddTransaction } from "./add-transaction";
import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";

export default function RecentTransactions({
  transactions,
  addTransaction,
  showViewAll = false,
}: {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  showViewAll?: boolean;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const sortedTransactions = transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {showViewAll ? "Your 7 most recent transactions." : "Your complete transaction history."}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          {showViewAll && transactions.length > 7 && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/transactions">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <AddTransaction addTransaction={addTransaction} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(showViewAll ? sortedTransactions.slice(0, 7) : sortedTransactions).map((transaction) => {
              const info = categoryInfo[transaction.category];
              const Icon = info.icon;
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground sm:hidden">{transaction.category}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                      <Icon className={`h-3 w-3 ${info.color}`} />
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     {new Date(transaction.date).toLocaleDateString("en-GB", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive"
                    }`}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
             {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <p className="text-muted-foreground">No transactions yet.</p>
                  <p className="text-sm text-muted-foreground">Add your first transaction to get started.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bill } from "@/lib/types";
import { ArrowRight, CalendarClock, BellOff } from "lucide-react";

export default function UpcomingBills({ bills }: { bills: Bill[] }) {
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
    
  const upcoming = bills
    .filter(b => !b.isPaid && new Date(b.dueDate) >= new Date())
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
    
  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: "Due today", color: "destructive" as const};
    if (diffDays === 1) return { text: "Due tomorrow", color: "secondary" as const };
    return { text: `Due in ${diffDays} days`, color: "default" as const};
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Upcoming Bills
        </CardTitle>
        <CardDescription>
          A quick look at your next few bills.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
            {upcoming.map((bill) => {
                const status = getDueDateStatus(bill.dueDate);
                return (
                    <div key={bill.id} className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-medium">{bill.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(bill.amount)}</p>
                        </div>
                        <Badge variant={status.color} className="rounded-md">{status.text}</Badge>
                    </div>
                )
            })}
             {upcoming.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4 h-full flex flex-col items-center justify-center">
                    <BellOff className="w-10 h-10 mb-2 text-primary/20" />
                    <p className="font-semibold text-foreground">No Upcoming Bills</p>
                    <p>You're all caught up!</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/bills">View All Bills <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

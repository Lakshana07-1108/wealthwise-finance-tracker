
"use client";

import * as React from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Bill } from "@/lib/types";
import { AddBill } from "@/components/dashboard/add-bill";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, CheckCircle, MoreVertical, Trash2, XCircle, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


export default function BillsPage() {
  const user = useUser();
  const { data: bills, loading } = useCollection<Bill>(user ? `users/${user.uid}/bills` : '');
  const { toast } = useToast();
  
  const sortedBills = React.useMemo(() => {
    if (!bills) return [];
    return [...bills].sort((a, b) => {
        if(a.isPaid && !b.isPaid) return 1;
        if(!a.isPaid && b.isPaid) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    });
  }, [bills]);

  const addBill = async (bill: Omit<Bill, "id">) => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/bills`), bill);
    }
  };

  const togglePaidStatus = async (billId: string, currentStatus: boolean) => {
    if(!user) return;
    const billRef = doc(db, `users/${user.uid}/bills`, billId);
    await updateDoc(billRef, { isPaid: !currentStatus });
    toast({
        title: `Bill marked as ${!currentStatus ? 'paid' : 'unpaid'}`,
    });
  }

  const deleteBill = async (billId: string) => {
      if(!user) return;
      await deleteDoc(doc(db, `users/${user.uid}/bills`, billId));
      toast({
        variant: "destructive",
        title: "Bill Deleted",
        description: "The bill has been removed from your list.",
      });
  }

  const resetPaidBills = async () => {
    if(!user) return;
    const batch = writeBatch(db);
    bills.filter(b => b.isPaid).forEach(bill => {
        const billRef = doc(db, `users/${user.uid}/bills`, bill.id);
        batch.update(billRef, { isPaid: false });
    });
    await batch.commit();
    toast({
        title: 'Paid bills reset',
        description: 'All paid bills have been marked as unpaid.',
    });
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getDueDateStatus = (dueDate: string, isPaid?: boolean) => {
    if(isPaid) return { text: "Paid", color: "default" as const, icon: CheckCircle };

    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: "destructive" as const, icon: XCircle };
    if (diffDays === 0) return { text: "Due today", color: "destructive" as const, icon: Bell };
    if (diffDays <= 3) return { text: `Due in ${diffDays} days`, color: "secondary" as const, icon: Bell };
    return { text: `Due on ${new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, color: "outline" as const, icon: Bell };
  }

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Bills & Subscriptions</h1>
            <p className="text-muted-foreground">Manage your recurring bills and subscriptions.</p>
        </div>
        <AddBill addBill={addBill} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>
                Keep track of your upcoming bills to avoid late fees.
            </CardDescription>
          </div>
          {bills.some(b => b.isPaid) && (
             <Button variant="outline" onClick={resetPaidBills}>
                <RotateCw className="mr-2 h-4 w-4" />
                Reset Paid Bills
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedBills.map((bill) => {
               const status = getDueDateStatus(bill.dueDate, bill.isPaid);
               const Icon = status.icon;
               return (
                <div key={bill.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${bill.isPaid ? 'bg-muted/50' : 'bg-card'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${bill.isPaid ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted'}`}>
                            <Icon className={`h-5 w-5 ${bill.isPaid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                            <p className={`font-semibold ${bill.isPaid ? 'line-through text-muted-foreground' : ''}`}>{bill.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(bill.amount)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant={status.color}>{status.text}</Badge>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => togglePaidStatus(bill.id, bill.isPaid || false)}>
                                    {bill.isPaid ? <><XCircle className="mr-2 h-4 w-4"/>Mark as Unpaid</> : <><CheckCircle className="mr-2 h-4 w-4"/>Mark as Paid</>}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => deleteBill(bill.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
               )
            })}
             {bills.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-12">
                    <BellOff className="mx-auto h-12 w-12 text-primary/20" />
                    <h3 className="mt-4 text-lg font-semibold">No Bills Added Yet</h3>
                    <p className="mt-2 text-sm">Click "Add Bill" to schedule your first payment and get reminders.</p>
                     <div className="mt-6">
                        <AddBill addBill={addBill}>
                             <Button>Add Your First Bill</Button>
                        </AddBill>
                    </div>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

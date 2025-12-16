
"use client";

import * as React from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Goal } from "@/lib/types";
import { AddGoal } from "@/components/dashboard/add-goal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddContribution } from "@/components/dashboard/add-contribution";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsPage() {
  const user = useUser();
  const { data: goals, loading } = useCollection<Goal>(`users/${user?.uid}/goals`);
  
  const addGoal = async (goal: Omit<Goal, "id" | "currentAmount">) => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/goals`), {
          ...goal,
          currentAmount: 0,
      });
    }
  };

  const addContribution = async (goalId: string, amount: number) => {
    if(!user) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const goalRef = doc(db, `users/${user.uid}/goals`, goalId);
    await updateDoc(goalRef, {
        currentAmount: goal.currentAmount + amount,
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress > 75) return "bg-blue-500";
    return "bg-primary";
  }

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
                <Skeleton className="h-56" />
                <Skeleton className="h-56" />
                <Skeleton className="h-56" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Goals</h1>
            <p className="text-muted-foreground">Set and track your financial goals to stay motivated.</p>
        </div>
        <AddGoal addGoal={addGoal} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          
          return (
            <Card key={goal.id} className="flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                  <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                       {progress >= 100 ? (
                           <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                               <Flag className="h-5 w-5" />
                               <span>Goal Reached!</span>
                           </div>
                       ) : (
                        <p className="text-sm text-muted-foreground">
                            Target: {formatCurrency(goal.targetAmount)}
                        </p>
                       )}
                  </div>
                  {goal.targetDate && (
                    <CardDescription>
                        Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                    </CardDescription>
                  )}
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                 <p className="text-sm text-muted-foreground">
                  Saved: <span className="font-bold text-foreground">{formatCurrency(goal.currentAmount)}</span>
                </p>
                <Progress value={progress} indicatorClassName={getProgressColor(progress)} />
              </CardContent>
              <CardFooter className="flex gap-2">
                <AddContribution goal={goal} addContribution={addContribution}>
                    <Button variant="outline" className="w-full" disabled={progress >= 100}>Add Contribution</Button>
                </AddContribution>
              </CardFooter>
            </Card>
          );
        })}
         {goals.length === 0 && !loading && (
          <Card className="md:col-span-2 lg:col-span-3">
             <CardContent className="p-6 text-center">
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                    <Target className="w-16 h-16 mb-4 text-primary/20" />
                    <h3 className="text-lg font-semibold mb-2">No Goals Set Yet</h3>
                    <p className="mb-4">Create your first financial goal to start saving for what matters.</p>
                    <AddGoal addGoal={addGoal}>
                        <Button>Create Your First Goal</Button>
                    </AddGoal>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

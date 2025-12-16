
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import type { Transaction } from "@/lib/types";
import {
  analyzeSpendingHabits,
  AnalyzeSpendingHabitsOutput,
} from "@/ai/flows/analyze-spending-habits";

export default function AiInsights({ transactions }: { transactions: Transaction[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeSpendingHabitsOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const transactionHistory = transactions
      .map(
        (t) =>
          `${t.date}: ${t.name} (${t.category}) - ₹${t.amount.toFixed(2)} (${
            t.type
          })`
      )
      .join("\n");

    try {
      const result = await analyzeSpendingHabits({ transactionHistory });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Get personalized recommendations based on your spending.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {analysis && (
          <div className="space-y-4 text-sm">
            <Card className="bg-muted/50 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Spending Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{analysis.summary}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  {analysis.recommendations.split('\n').map((rec, index) => (
                     rec.trim() && <li key={index} className="flex items-start gap-2">
                       <Lightbulb className="h-4 w-4 mt-1 text-yellow-400 flex-shrink-0" />
                       <span>{rec.replace(/^- /, '')}</span>
                      </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
        {!isLoading && !analysis && !error && (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full p-6">
            <Sparkles className="h-12 w-12 text-primary/20 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Unlock Your Financial Superpowers</h3>
            <p>Click the button below to get smart, AI-powered insights on your spending habits.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalysis}
          disabled={isLoading || transactions.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze My Spending
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

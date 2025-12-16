
import Link from "next/link";
import { ArrowRight, BarChart, Bot, LayoutDashboard, Sparkles } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 lg:py-20 text-center">
          <div className="max-w-3xl mx-auto">
             <div className="mb-4">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  <span>AI-Powered Finance Tracking</span>
                </div>
              </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
              Take Control of Your Finances
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8">
              WealthWise helps you track your spending, manage budgets, and get
              AI-powered insights to achieve your financial goals.
            </p>
            <Button size="lg" asChild className="h-12 text-base px-8">
              <Link href="/login">
                Start for Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
        
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">All-in-One Finance Tracker</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Everything you need to manage your money effectively, from smart dashboards to AI-driven recommendations that help you save more.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-start p-6 bg-card border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
                  <p className="text-muted-foreground">Visualize your income, expenses, and savings at a glance.</p>
                </div>
                <div className="flex flex-col items-start p-6 bg-card border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                   <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                    <BarChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                  <p className="text-muted-foreground">Track spending by category and identify savings opportunities.</p>
                </div>
                <div className="flex flex-col items-start p-6 bg-card border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">Get personalized tips and recommendations from our smart assistant.</p>
                </div>
              </div>
          </div>
        </section>

      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} WealthWise. All rights reserved.
          </p>
          <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

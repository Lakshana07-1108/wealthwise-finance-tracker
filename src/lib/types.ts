
import type { LucideIcon } from "lucide-react";
import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export type Category =
  | "Food"
  | "Travel"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Income";

export type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: Category;
  type: "income" | "expense";
  source?: 'manual' | 'scan';
};

export type CategoryInfo = {
  icon: LucideIcon;
  color: string;
};

export type Budget = {
  id: string;
  category: Category;
  total: number;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  isPaid?: boolean;
};

export type Goal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
};

export interface UserProfile {
    name?: string;
    avatar?: string;
}

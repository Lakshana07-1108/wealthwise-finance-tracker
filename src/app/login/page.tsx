
import Logo from "@/components/logo";
import { Skeleton } from '@/components/ui/skeleton';
import { AuthForm } from "@/components/auth-form";
import ClientOnly from "@/components/client-only";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AuthFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  )
}


export default function AuthenticationPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
            <Logo />
            <h1 className="text-2xl font-semibold tracking-tight">
                Welcome to WealthWise
            </h1>
            <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
            </p>
        </div>
         <ClientOnly fallback={<AuthFormSkeleton />}>
          <AuthForm />
        </ClientOnly>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

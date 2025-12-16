
import { Scale } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-lg">
        <Scale className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold text-primary tracking-tight">WealthWise</h1>
    </div>
  );
}

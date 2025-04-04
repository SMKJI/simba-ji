
import React from "react";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ className, children, ...props }: ShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      <div className="container py-6">
        {children}
      </div>
    </div>
  );
}

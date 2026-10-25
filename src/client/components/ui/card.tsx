import type * as React from "react";
import { cn } from "../../utils/cn.ts";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
}

export function Card({ className, title, extra, children, ...props }: CardProps) {
  if (title || extra) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-background text-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border p-4 sm:px-6">
          <div className="font-semibold leading-none tracking-tight">{title}</div>
          {extra && <div>{extra}</div>}
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background text-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

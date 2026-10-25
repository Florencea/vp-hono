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
          "rounded-xl border border-border bg-card text-card-foreground shadow-xs",
          className,
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{title}</CardTitle>
          {extra && <div>{extra}</div>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-xs",
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
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight text-card-foreground", className)}
      {...props}
    />
  );
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

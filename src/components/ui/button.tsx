import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:brightness-95": variant === "default",
          "bg-accent text-accent-foreground hover:brightness-95": variant === "secondary",
          "border border-border bg-card hover:bg-muted": variant === "outline",
          "hover:bg-muted": variant === "ghost",
          "bg-rose text-white hover:brightness-95": variant === "destructive",
        },
        {
          "h-10 px-4 py-2 text-sm": size === "default",
          "h-8 rounded-lg px-3 text-xs": size === "sm",
          "h-12 px-6 text-base": size === "lg",
          "h-10 w-10": size === "icon",
        },
        className,
      )}
      {...props}
    />
  );
}

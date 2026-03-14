import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ url, name, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold shadow-md",
        "bg-gradient-to-br from-primary to-accent text-primary-foreground",
        sizeClasses[size],
        className
      )}
    >
      {url ? (
        <img
          src={url}
          alt={name || "Avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      {!url && <span>{getInitials(name)}</span>}
    </div>
  );
}

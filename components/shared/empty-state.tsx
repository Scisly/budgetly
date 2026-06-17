import type { ReactNode } from "react";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyStateProps {
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <Empty
      className={cn(
        "border-border bg-muted/30",
        compact ? "min-h-64 p-8" : "p-12",
        className
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        {title ? <EmptyTitle>{title}</EmptyTitle> : null}
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}

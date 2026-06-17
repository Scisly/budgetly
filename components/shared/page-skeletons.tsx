import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeaderSkeleton />
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export function ListPageSkeleton({ withFilters = false }: { withFilters?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      {withFilters && <Skeleton className="h-36 rounded-xl" />}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function BudgetsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ComparePageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeaderSkeleton />
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-40 rounded-xl" />
      ))}
    </div>
  );
}

import type { ReactNode } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { FilterChip } from "@/components/ui/FilterChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mapErrorMessage } from "@/services/errorMapper";

type FeaturePreviewPageProps<T> = {
  eyebrow: string;
  title: string;
  description: string;
  query: {
    data: T[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => Promise<unknown>;
  };
  chips: string[];
  renderContent: (items: T[]) => ReactNode;
  emptyTitle: string;
  emptyDescription: string;
};

export function FeaturePreviewPage<T>({
  eyebrow,
  title,
  description,
  query,
  chips,
  renderContent,
  emptyTitle,
  emptyDescription,
}: FeaturePreviewPageProps<T>) {
  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.isError) {
    return (
      <ErrorState
        message={mapErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const items = query.data ?? [];

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="flex flex-wrap gap-3">
        {chips.map((chip, index) => (
          <FilterChip key={chip} active={index === 0}>
            {chip}
          </FilterChip>
        ))}
      </div>
      {items.length > 0 ? (
        renderContent(items)
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}

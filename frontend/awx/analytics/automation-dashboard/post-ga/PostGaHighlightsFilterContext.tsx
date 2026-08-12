import { createContext, ReactNode, useContext, useMemo } from 'react';
import { getOrgFilterScale } from './postGaHighlightsFilterUtils';

interface PostGaHighlightsFilterContextValue {
  organizationFilterIds: string[];
  periodScale: number;
  orgFilterScale: number;
}

const PostGaHighlightsFilterContext = createContext<PostGaHighlightsFilterContextValue | null>(
  null
);

export function PostGaHighlightsFilterProvider({
  children,
  organizationFilterIds,
  periodScale,
}: Readonly<{
  children: ReactNode;
  organizationFilterIds: string[];
  periodScale: number;
}>) {
  const value = useMemo(
    () => ({
      organizationFilterIds,
      periodScale,
      orgFilterScale: getOrgFilterScale(organizationFilterIds),
    }),
    [organizationFilterIds, periodScale]
  );

  return (
    <PostGaHighlightsFilterContext.Provider value={value}>
      {children}
    </PostGaHighlightsFilterContext.Provider>
  );
}

export function usePostGaHighlightsFilters(): PostGaHighlightsFilterContextValue {
  const context = useContext(PostGaHighlightsFilterContext);
  if (!context) {
    throw new Error(
      'usePostGaHighlightsFilters must be used within PostGaHighlightsFilterProvider'
    );
  }
  return context;
}

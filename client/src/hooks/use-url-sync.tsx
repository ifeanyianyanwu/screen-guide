// hooks/useUrlSync.ts
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUrlSync() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateUrl = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });
      replace(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  const getInitialValue = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  return { updateUrl, getInitialValue };
}

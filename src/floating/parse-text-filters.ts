import type {
  FilterCombination,
  FilterModelItem,
  FilterString,
} from "@1771technologies/lytenyte-pro/types";

const specialChars = /[.^$*+?{}[\]\\|()]/;
export function parseTextFilter(src: string) {
  if (!src.trim()) return null;
  const parts = src.split("||").map((c) => c.trim());

  const filters = parts.map((c) => {
    const regex = specialChars.test(c);

    let isValidRegex = regex;
    if (regex) {
      try {
        new RegExp(c);
      } catch {
        isValidRegex = false;
      }
    }

    if (isValidRegex) {
      return {
        kind: "string",
        operator: "matches",
        value: c,
        options: {
          caseInsensitive: true,
          regexOpts: "ig",
        },
      } satisfies FilterString;
    }

    return {
      kind: "string",
      operator: "contains",
      value: c,
      options: {
        caseInsensitive: true,
      },
    } satisfies FilterString;
  });

  return {
    filters,
    kind: "combination",
    operator: "OR",
  } satisfies FilterCombination;
}

export function unparseTextFilter(
  filter: FilterModelItem<(string | number | null)[]> | undefined
) {
  if (filter == null) return "";

  if (isIncompatibleTextFilter(filter)) return "-";

  if (filter?.kind === "string") return filter.value as string;

  const filters = (filter as any).filters.map((c: any) => {
    if (c.kind !== "string") return;

    return c.value as string;
  });

  return filters.join(" || ");
}

export function isIncompatibleTextFilter(
  filter: FilterModelItem<any> | undefined
) {
  if (filter == null) return false;

  if (
    filter?.kind === "string" &&
    filter.operator !== "contains" &&
    filter.operator !== "matches"
  ) {
    return true;
  }

  if (
    filter?.kind === "combination" &&
    filter.filters.some((f) => isIncompatibleTextFilter(f))
  ) {
    return true;
  }

  return false;
}

export const STRING_SORT_ON_OPTIONS = [
  { id: "values", label: "Values" },
  { id: "insensitive", label: "Insensitive" },
  { id: "ignore_punctuation", label: "Ignore Punctuation" },
  { id: "nulls_first", label: "Nulls First" },
] as const;

export const NUMBER_SORT_ON_OPTIONS = [
  { id: "values", label: "Values" },
  { id: "absolute", label: "Absolute" },
  { id: "nulls_first", label: "Nulls First" },
] as const;

export type SortOnOption = { id: string; label: string };

export function getSortOnOptionsForType(
  type: string | undefined,
): SortOnOption[] {
  return type === "number"
    ? (NUMBER_SORT_ON_OPTIONS as unknown as SortOnOption[])
    : (STRING_SORT_ON_OPTIONS as unknown as SortOnOption[]);
}

export function getSortOnOptions(id: string) {
  return {
    nullsFirst: id === "nulls_first",
    caseInsensitive: id === "insensitive",
    ignorePunctuation: id === "ignore_punctuation",
    absolute: id === "absolute",
  };
}

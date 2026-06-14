export interface SortEntry {
  id: string;
  columnId: string | null;
  descending: boolean;
  sortOnId: string; // "values" by default
}

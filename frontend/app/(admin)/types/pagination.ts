export type Pagination = {
  current: number;
  pages: number;
  items: number;
  limit: number;
  next: number | null;
  prev: number | null;
};

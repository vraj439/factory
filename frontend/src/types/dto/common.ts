export interface IPaginationResponse<T> {
  items: T[];
  total: number;
  pages: number;
  current_page: number;
}

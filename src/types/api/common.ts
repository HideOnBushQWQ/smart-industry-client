/**
 * Unified backend response wrapper.
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T | null;
  [property: string]: any;
}

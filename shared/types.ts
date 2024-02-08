export interface Duty {
  id: string;
  name: string;
}

export interface APIResponse<D extends object = object> {
  success: boolean;
  data: D | null;
  message: string;
}

export interface PaginationData<E extends object = object> {
  pagination: {
    cursor: string;
  };
  items: E[];
}

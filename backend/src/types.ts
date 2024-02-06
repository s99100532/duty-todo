export interface Duty {
  id: number;
  name: string;
}


export interface APIResponse {
  success: boolean;
  data: unknown;
  message: string;
}
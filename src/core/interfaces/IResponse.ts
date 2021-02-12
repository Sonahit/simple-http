export interface IResponse<
  Data extends Record<string, any> = Record<string, any>
> {
  success: boolean;
  code: number;
  data?: Data;
}

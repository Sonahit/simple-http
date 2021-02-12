export interface IRequest<
  Data extends Record<string, any> = Record<string, any>
> {
  path: string;
  data: Data;
}

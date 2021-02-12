import { IResponse } from "../interfaces/IResponse";
import { TFactory } from "../types/TFactory";

export const create: TFactory<IResponse> = <
  T extends Record<string, any> = any
>(
  success: boolean,
  code: number,
  data: T
): IResponse => {
  return { code, success, data };
};

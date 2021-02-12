import { TFactory } from "../types/TFactory";
import { IRequest } from "../interfaces/IRequest";

export const create: TFactory<IRequest> = <T extends Record<string, any> = any>(
  data: T,
  path: string
): IRequest<T> => {
  return { data, path };
};

import { Either } from "fp-ts/lib/Either";

export type RouteHandler<T, U, Error = any> = (
  data: T
) => U extends PromiseLike<infer R>
  ? Either<R, Error>
  : U extends (...args: any) => any
  ? Either<ReturnType<U>, Error>
  : Either<U, Error>;

export type PathExpression = string | RegExp;

export type TRoute<Data = any, Response = any> = {
  pathExpr: PathExpression;
  handler: RouteHandler<Data, Response>;
};

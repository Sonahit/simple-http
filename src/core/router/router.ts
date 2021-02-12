import { PathExpression, TRoute } from "../types/TRoute";
import { TRouter } from "../types/TRouter";
import * as pathToRegex from "path-to-regexp";
import { none, Option, some } from "fp-ts/lib/Option";

export function createRouter(...routes: TRoute[]): TRouter {
  return {
    routes: routes,
  };
}

export function match(path: string, routePath: PathExpression): boolean {
  let routeExpr: RegExp;
  if (typeof routePath === "string") {
    routeExpr = pathToRegex.pathToRegexp(routePath.replace(/\//g, "/"));
  } else {
    routeExpr = pathToRegex.pathToRegexp(routePath);
  }
  return routeExpr.test(path);
}

export function findRoute(path: string, router: TRouter): Option<TRoute> {
  const { routes } = router;
  const route = routes.find((v) => match(path, v.pathExpr));
  return route ? some(route) : none;
}

import { right } from "fp-ts/lib/Either";
import { TRoute } from "../core/types/TRoute";

export const ping: TRoute<any, string> = {
  pathExpr: "/ping",
  handler: () => {
    return right({ success: true, data: "pong", code: 200 });
  },
};

export default [ping];

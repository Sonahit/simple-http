import { IRequest } from "./core/interfaces/IRequest";
import { IResponse } from "./core/interfaces/IResponse";
import { createRouter, findRoute } from "./core/router/router";
import * as requestFactory from "./core/factories/request.factory";
import { TApp } from "./core/types/TApp";
import http from "http";
import pingRoutes from "./routes/ping.routes";
import { pipe } from "fp-ts/lib/function";

function createApp(): TApp {
  const router = createRouter(...pingRoutes);
  return {
    router,
  };
}

export function makeRequest(request: IRequest, app: TApp): IResponse {
  const route = findRoute(request.path, app.router);
  switch (route._tag) {
    case "None": {
      return { success: false, code: 404 };
    }
    case "Some": {
      const { handler } = route.value;
      const result = pipe(handler(request.data));

      if (result._tag === "Right") {
        return result.right;
      }

      return { data: result.left, code: 400, success: false };
    }
  }
}

function writeResponse(
  response: http.ServerResponse,
  body: IResponse<Buffer>
): void {
  const headers: Record<string, any> = {
    Connection: "closed",
  };
  if (body.data) {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = body.data.byteLength;
  }
  response.writeHead(500, headers);
  response.write(body);
  response.end();
}

export function createServer(app: TApp): http.Server {
  return http.createServer((clientRequest, hostResponse) => {
    new Promise<IRequest>((resolve, reject) => {
      let data = "";
      let jsonData: Record<string, any>;
      clientRequest.on("data", (_data) => {
        data += _data;
      });

      clientRequest.on("end", () => {
        try {
          jsonData = JSON.parse(data);
          resolve(requestFactory.create(jsonData, clientRequest.url || ""));
        } catch (e) {
          reject();
        }
      });
    })
      .then((request) => makeRequest(request, app))
      .then((r) => {
        const body = Buffer.from(JSON.stringify(r));
        writeResponse(hostResponse, {
          code: r.code,
          success: r.success ?? true,
          data: body,
        });
      })
      .catch((err: Error) => {
        const body = Buffer.from(`${err.name} ${err.message}\n${err.stack}`);
        writeResponse(hostResponse, { code: 500, success: false, data: body });
      });
  });
}

const app = createApp();

export default app;

import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { handler as enquiryHandler } from "./netlify/functions/send-enquiry";

const ENQUIRY_ENDPOINT_PATH = "/.netlify/functions/send-enquiry";

const readRequestBody = async (request: IncomingMessage) => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

const sendNodeResponse = (
  response: ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  body: string,
) => {
  response.statusCode = statusCode;
  Object.entries(headers).forEach(([headerName, headerValue]) => {
    response.setHeader(headerName, headerValue);
  });
  response.end(body);
};

const enquiryDevMiddleware = () => ({
  name: "enquiry-dev-middleware",
  configureServer(server: {
    middlewares: {
      use: (middleware: (
        request: IncomingMessage,
        response: ServerResponse,
        next: (error?: Error) => void,
      ) => void | Promise<void>) => void;
    };
  }) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url || !request.url.startsWith(ENQUIRY_ENDPOINT_PATH)) {
        next();
        return;
      }

      try {
        const bodyBuffer = await readRequestBody(request);
        const normalizedHeaders = Object.entries(request.headers).reduce<Record<string, string | undefined>>(
          (carry, [headerName, headerValue]) => {
            carry[headerName] = Array.isArray(headerValue) ? headerValue.join(", ") : headerValue;
            return carry;
          },
          {},
        );

        const result = await enquiryHandler({
          httpMethod: request.method || "GET",
          headers: normalizedHeaders,
          body: bodyBuffer.toString("base64"),
          isBase64Encoded: true,
        });

        sendNodeResponse(response, result.statusCode, result.headers, result.body);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Local enquiry handler failed.";
        sendNodeResponse(
          response,
          500,
          { "Content-Type": "application/json" },
          JSON.stringify({ ok: false, error: message }),
        );
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), enquiryDevMiddleware()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

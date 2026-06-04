import z from "zod";
import apiDescription from "./api.md?raw";
import listenDescription from "./listen.md?raw";
import routingDescription from "./routingService.md?raw";
import handlerServiceDescription from "./handlerService.md?raw";

const apiServices = z.union([
  z.literal("HandlerService").meta({
    markdownDescription: handlerServiceDescription,
  }),
  z.literal("RoutingService").meta({
    markdownDescription: routingDescription,
  }),
  z.literal("LoggerService").meta({
    markdownDescription: `Supports restarting the built-in Logger, which can be used with \`logrotate\` to perform operations on log files.`,
  }),
  z.literal("StatsService").meta({
    markdownDescription: `Built-in data statistics service. See [Statistics](https://xtls.github.io/en/config/stats.html) for details.`,
  }),
  z.literal("ReflectionService").meta({
    markdownDescription: `Allows gRPC clients to retrieve the list of APIs on the server.`,
  }),
]);

export const apiSchema = z
  .object({
    tag: z.string().meta({
      markdownDescription: "The identifier of the outbound proxy.",
    }),
    listen: z.string().optional().meta({
      markdownDescription: listenDescription,
    }),
    services: z.array(apiServices).optional().meta({
      uniqueItems: true,
      markdownDescription: `The list of enabled APIs. See [API List](https://xtls.github.io/en/config/api.html#supported-api-list) for available values.`,
    }),
  })
  .meta({
    markdownDescription: apiDescription,
  });

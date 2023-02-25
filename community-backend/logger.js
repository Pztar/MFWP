import { createLogger, format, transport } from "winston";

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transport.File({ filename: "combined.log" }),
    new transport.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transport.Console({ format: format.simple() }));
}

export default logger;

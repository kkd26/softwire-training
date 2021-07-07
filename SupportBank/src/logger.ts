import { configure, getLogger } from "log4js";

configure({
  appenders: {
    file: { type: "fileSync", filename: "logs/debug.log" },
  },
  categories: {
    default: { appenders: ["file"], level: "debug" },
  },
});

const logger = getLogger("log.txt");

export default logger;

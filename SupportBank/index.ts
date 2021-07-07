import { configure, getLogger } from "log4js";
import readline from "readline";
import Bank from "./Bank";

configure({
  appenders: {
    file: { type: "fileSync", filename: "logs/debug.log" },
  },
  categories: {
    default: { appenders: ["file"], level: "debug" },
  },
});

const logger = getLogger("log.txt");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((res, rej) => {
    rl.question(question, (answer: string) => {
      res(answer);
    });
  });
}

async function menu() {
  while (true) {
    const ans = await ask(
      "\nUsage: List All | List [name] | Import File [filename] | quit\n"
    );
    logger.info("Command: " + ans);
    switch (ans) {
      case "quit":
        logger.info("Quit");
        rl.close();
        logger.info("ReadLine stream closed");
        return;
      case "List All":
        bank.listAll();
        logger.info("List All executed");
        break;
      default:
        if (ans.startsWith("List ")) {
          const name = ans.replace(/^List /, "");
          bank.listTransactions(name);
          logger.info("List Transactions executed");
        } else if (ans.startsWith("Import File ")) {
          const filename = ans.replace(/^Import File /, "");
          const ext = filename.split(".").pop();
          var handler = undefined;
          switch (ext) {
            case "csv":
              handler = bank.fromCSV;
              break;
            case "json":
              handler = bank.fromJSON;
              break;
            case "xml":
              handler = bank.fromXML;
              break;
            default:
              console.log("Unsupported file extension");
          }

          handler &&
            (await handler
              .bind(bank)(filename)
              .catch((err) => {
                console.log(err);
                logger.error(err);
              }));
        } else if (ans.startsWith("Export File ")) {
        } else {
          console.log("Unknown command");
        }
    }
  }
}

const bank = new Bank();

menu();

export { logger };

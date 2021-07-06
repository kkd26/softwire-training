import readline from "readline";
import Bank from "./Bank";
import { configure, getLogger } from "log4js";

configure({
  appenders: {
    file: { type: "fileSync", filename: "logs/debug.log" },
  },
  categories: {
    default: { appenders: ["file"], level: "error" },
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

const bank = new Bank();

bank.fromCSV("./DodgyTransactions2015.csv").then(async (val) => {
  while (true) {
    const ans = await ask("\nUsage: List All | List [Name] | quit\n");
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
        if (!ans.startsWith("List ")) continue;
        const name = ans.replace(/^List /, "");
        bank.listTransactions(name);
        logger.info("List Transactions executed");
    }
  }
});

export { logger };

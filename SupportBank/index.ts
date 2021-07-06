import readline from "readline";
import Bank from "./Bank";

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

bank.fromCSV("./Transactions2014.csv").then(async (val) => {
  while (true) {
    const ans = await ask("\nUsage: List All | List [Name] | quit\n");
    switch (ans) {
      case "quit":
        rl.close();
        return;
      case "List All":
        bank.listAll();
        break;
      default:
        if (!ans.startsWith("List ")) continue;
        const name = ans.replace(/^List /, "");
        bank.listTransactions(name);
    }
  }
});

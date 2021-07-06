import parse from "csv-parse";
import path from "path";
import fs from "fs";
import BankAccount from "./BankAccount";

class Bank {
  private accounts: { [name: string]: BankAccount };

  constructor() {
    this.accounts = {};
  }

  fromCSV(file: string): Promise<void> {
    const _this = this;

    const output: string[][] = [];

    return new Promise((res, rej) => {
      fs.createReadStream(path.resolve(file))
        .pipe(parse({ delimiter: "," }))
        .on("data", function (row: string[]) {
          output.push(row);
        })
        .on("end", function () {
          output.shift(); // Delete column names
          output.forEach((transaction) => {
            const [day, month, year] = transaction[0].split("/");
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            const from = transaction[1];
            const to = transaction[2];
            const narrative = transaction[3];
            const amount = Number(transaction[4]);
            _this.transaction(date, from, to, narrative, amount);
          });
          res();
        });
    });
  }

  addPerson(name: string) {
    this.accounts[name] = new BankAccount(name);
    return this.accounts[name];
  }

  private credit(date: Date, name: string, narrative: string, amount: number) {
    let account = this.accounts[name] || this.addPerson(name);
    account.credit(amount, date, narrative);
  }

  transaction(
    date: Date,
    from: string,
    to: string,
    narrative: string,
    amount: number
  ) {
    this.credit(date, from, narrative, amount);
    this.credit(date, to, narrative, -amount);
  }

  listAll() {
    for (const name in this.accounts) {
      if (Object.prototype.hasOwnProperty.call(this.accounts, name)) {
        const account = this.accounts[name];
        account.statement();
      }
    }
  }

  listTransactions(name: string) {
    this.accounts[name] && this.accounts[name].listTransactions();
  }
}

export default Bank;

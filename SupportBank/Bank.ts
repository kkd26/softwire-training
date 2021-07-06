import parse from "csv-parse";
import path from "path";
import fs from "fs";
import BankAccount from "./BankAccount";
import { logger } from "./index";

class Bank {
  private accounts: { [name: string]: BankAccount } = {};
  private transactions: string[][] = [];

  fromCSV(file: string): Promise<void> {
    logger.info("Method call on Bank: fromCSV");
    const _this = this;

    return new Promise((res, rej) => {
      fs.createReadStream(path.resolve(file))
        .pipe(parse({ delimiter: "," }))
        .on("data", function (row: string[]) {
          _this.transactions.push(row);
        })
        .on("end", function () {
          _this.transactions.shift(); // Delete column names
          _this.transactions.forEach((transaction, index) => {
            try {
              const [day, month, year] = transaction[0].split("/");
              const date = new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
              );
              if (isNaN(date.getTime())) {
                const error = `Parsing Error. ${file}:${index + 2} - ${
                  transaction[0]
                } is not a date in format dd/mm/yyyy`;
                throw error;
              }
              const from = transaction[1];
              const to = transaction[2];
              const narrative = transaction[3];
              const amount = Number(transaction[4]);
              if (isNaN(amount)) {
                const error = `Parsing Error. ${file}:${index + 2} - ${
                  transaction[4]
                } is not a number`;
                throw error;
              }
              _this.transaction(date, from, to, narrative, amount);
            } catch (error) {
              console.error(error);
              return logger.error(error);
            }
          });
          res();
        });
    });
  }

  addPerson(name: string) {
    logger.info(`Method call on Bank: Add Person - ${name}`);
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
    logger.info(
      `Method call on Bank: Transaction - ${date.toDateString()} -- ${from} -- ${to} -- ${narrative} -- ${amount}`
    );
    this.credit(date, from, narrative, amount);
    this.credit(date, to, narrative, -amount);
  }

  listAll() {
    logger.info(`Method call on Bank: List All`);
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

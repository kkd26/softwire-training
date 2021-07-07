import parse from "csv-parse";
import fs from "fs";
import path from "path";
import { parseStringPromise as parseXML } from "xml2js";
import BankAccount from "./BankAccount";
import {
  fromCSVEntry,
  fromJSONEntry,
  fromXMLEntry,
  toCSV,
  toJSON,
  toXML,
} from "./helper";
import { logger } from "./index";
import Transaction from "./Transaction";

class Bank {
  private accounts: { [name: string]: BankAccount } = {};
  private transactions: Transaction[] = [];

  fromCSV(file: string): Promise<void> {
    logger.info("Method call on Bank: fromCSV");
    this.clearBank();
    const _this = this;

    const output: string[][] = [];

    return new Promise((res, rej) => {
      if (!fs.existsSync(path.resolve(file))) {
        return rej("File doesn't exist");
      }

      fs.createReadStream(path.resolve(file))
        .pipe(parse({ delimiter: "," }))
        .on("data", function (row: string[]) {
          output.push(row);
        })
        .on("end", function () {
          output.shift(); // Delete column names
          output.forEach((row, index) => {
            try {
              const transaction = fromCSVEntry(row);
              _this.transaction(transaction);
            } catch (err) {
              const error = `Parsing Error. ${file}:${index + 2} - ${err}`;
              console.error(error);
              return logger.error(error);
            }
          });
          console.log(`File ${file} loaded`);
          logger.info(`File ${file} loaded`);
          res();
        });
    });
  }

  fromJSON(file: string): Promise<void> {
    logger.info("Method call on Bank: fromJSON");
    this.clearBank();
    const _this = this;
    return new Promise((res, rej) => {
      if (!fs.existsSync(path.resolve(file))) {
        return rej("File doesn't exist");
      }

      const rawData = fs.readFileSync(path.resolve(file), {
        encoding: "utf-8",
      });
      const data = JSON.parse(rawData);

      for (const entry of data) {
        try {
          const transaction = fromJSONEntry(entry);
          _this.transaction(transaction);
        } catch (err) {
          const error = `Parsing Error. ${err}`;
          console.error(error);
          logger.error(error);
        }
      }
      console.log(`File ${file} loaded`);
      logger.info(`File ${file} loaded`);
      res();
    });
  }

  fromXML(file: string): Promise<void> {
    this.clearBank();
    const _this = this;
    return new Promise(async (res, rej) => {
      if (!fs.existsSync(path.resolve(file))) {
        return rej("File doesn't exist");
      }
      const rawData = fs.readFileSync(path.resolve(file), {
        encoding: "utf-8",
      });
      const data = await parseXML(rawData);
      for (const entry of data.TransactionList.SupportTransaction) {
        try {
          const transaction = fromXMLEntry(entry);
          _this.transaction(transaction);
        } catch (err) {
          const error = `Parsing Error. ${err}`;
          console.error(error);
          logger.error(error);
        }
      }
      console.log(`File ${file} loaded`);
      logger.info(`File ${file} loaded`);
      res();
    });
  }

  exportTransactions(filename: string) {
    const filePath = path.resolve(filename);
    if (fs.existsSync(filePath)) {
      return console.log("File exists");
    }

    const ext = filename.split(".").pop();
    var out = undefined;
    switch (ext) {
      case "csv":
        out = toCSV(this.transactions, ",");
        break;
      case "json":
        out = toJSON(this.transactions);
        break;
      case "xml":
        out = toXML(this.transactions);
        break;
    }
    if (out) {
      fs.writeFileSync(filePath, out);
      console.log(`Transactions exported to file ${filename}`);
    }
  }

  clearBank() {
    this.transactions = [];
    this.accounts = {};
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

  transaction({ date, from, to, narrative, amount }: Transaction) {
    logger.info(
      `Method call on Bank: Transaction - ${date.toDateString()} -- ${from} -- ${to} -- ${narrative} -- ${amount}`
    );
    this.transactions.push({ date, from, to, narrative, amount });
    this.credit(date, from || "", narrative, amount);
    this.credit(date, to || "", narrative, -amount);
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

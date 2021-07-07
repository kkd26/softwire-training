import { EmptyNameError, Transaction } from "./Models";

class BankAccount {
  private _name: string;
  private _amount: number;
  private _transactions: Transaction[] = [];

  constructor(name: string) {
    if (!name) throw new EmptyNameError("Empty Person Name");
    this._name = name;
    this._amount = 0.0;
  }

  public get name() {
    return this._name;
  }

  public set name(name) {
    this._name = name;
  }

  public get amount() {
    return this._amount;
  }

  credit(amount: number, date: Date, narrative: string): void {
    this._transactions.push({ amount, date, narrative });
    this._amount -= amount;
  }

  statement(): string {
    const out =
      this.name.padEnd(10) +
      ": " +
      (this._amount > 0 ? "+" : "") +
      this._amount.toFixed(2);
    return out;
  }

  listTransactions(): string {
    var out = "";
    this._transactions.forEach((transaction) => {
      out +=
        transaction.date.toDateString().padEnd(20) +
        transaction.narrative.padEnd(40) +
        (transaction.amount > 0 ? "+" : "") +
        transaction.amount +
        "\n";
    });
    return out;
  }
}

export default BankAccount;

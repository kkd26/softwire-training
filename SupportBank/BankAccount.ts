import Transaction from "./Transaction";

class BankAccount {
  private _name: string;
  private _amount: number;
  private _transactions: Transaction[] = [];

  constructor(name: string) {
    this._name = name;
    this._amount = 0.0;
  }

  public get name() {
    return this._name;
  }

  public set name(name) {
    this._name = name;
  }

  credit(amount: number, date: Date, narrative: string) {
    this._transactions.push({ amount, date, narrative });
    this._amount -= amount;
  }

  statement() {
    console.log(
      this.name.padEnd(10) +
        ": " +
        (this._amount > 0 ? "+" : "") +
        this._amount.toFixed(2)
    );
  }

  listTransactions() {
    this._transactions.forEach((transaction) => {
      console.log(
        transaction.date.toDateString().padEnd(20) +
          transaction.narrative.padEnd(40) +
          (transaction.amount > 0 ? "+" : "") +
          transaction.amount
      );
    });
  }
}

export default BankAccount;

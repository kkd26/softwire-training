import { Builder } from "xml2js";
import Transaction from "./Transaction";
const NUM_MILL_IN_DAY = 24 * 60 * 60 * 1000;

export function fromCSVEntry(row: string[]): Transaction {
  const [day, month, year] = row[0].split("/");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(date.getTime()))
    throw `${row[0]} is not a date in format dd/mm/yyyy`;

  const from = row[1];
  const to = row[2];
  const narrative = row[3];
  const amount = Number(row[4]);

  if (isNaN(amount)) throw `${row[4]} is not a number`;

  return { date, from, to, narrative, amount };
}

export function fromJSONEntry(entry: {
  Date: string;
  FromAccount: string;
  ToAccount: string;
  Narrative: string;
  Amount: string;
}): Transaction {
  const date = new Date(entry.Date);
  if (isNaN(date.getTime())) throw `${entry.Date} is not a date`;
  const from = entry.FromAccount;
  const to = entry.ToAccount;
  const narrative = entry.Narrative;
  const amount = Number(entry.Amount);
  if (isNaN(amount)) throw `${entry.Amount} is not a number`;

  return { date, from, to, narrative, amount };
}

export function fromXMLEntry(entry: {
  $: { Date: string };
  Description: string[];
  Value: string[];
  Parties: Array<{ From: string[]; To: string[] }>;
}): Transaction {
  const date = new Date((Number(entry.$.Date) - 70 * 365) * NUM_MILL_IN_DAY);
  if (isNaN(date.getTime())) throw `${entry.$.Date} is not a date`;
  const from = entry.Parties[0].From[0];
  const to = entry.Parties[0].To[0];
  const narrative = entry.Description[0];
  const amount = Number(entry.Value[0]);
  if (isNaN(amount)) throw `${entry.Value[0]} is not a number`;

  return { date, from, to, narrative, amount };
}

export function toCSV(transactions: Transaction[], delimiter: string): string {
  const headings = ["Date", "From", "To", "Narrative", "Amount"].join(
    delimiter
  );
  const out = [headings];
  transactions.forEach((transaction) => {
    const year = transaction.date.getFullYear();
    const month = (transaction.date.getMonth() + 1).toString().padStart(2, "0");
    const day = transaction.date.getDate().toString().padStart(2, "0");

    const row = [
      [day, month, year].join("/"),
      transaction.from,
      transaction.to,
      transaction.narrative,
      transaction.amount.toString(),
    ];
    out.push(row.join(delimiter));
  });
  return out.join("\n");
}

export function toJSON(transactions: Transaction[]): string {
  const out: Array<{
    Date: string;
    FromAccount: string;
    ToAccount: string;
    Narrative: string;
    Amount: number;
  }> = [];
  transactions.forEach((transaction) => {
    const entry = {
      Date: transaction.date.toISOString(),
      FromAccount: transaction.from || "",
      ToAccount: transaction.to || "",
      Narrative: transaction.narrative,
      Amount: transaction.amount,
    };
    out.push(entry);
  });
  return JSON.stringify(out);
}

export function toXML(transactions: Transaction[]): string {
  const obj: Array<{
    SupportTransaction: {
      $: { Date: string };
      Description: string[];
      Value: string[];
      Parties: Array<{ From: string[]; To: string[] }>;
    };
  }> = [];

  transactions.forEach((transaction) => {
    const entry = {
      SupportTransaction: {
        $: {
          Date: (
            Math.round(transaction.date.getTime() / NUM_MILL_IN_DAY) +
            70 * 365
          ).toString(),
        },
        Description: [transaction.narrative],
        Value: [transaction.amount.toString()],
        Parties: [
          { From: [transaction.from || ""], To: [transaction.to || ""] },
        ],
      },
    };
    obj.push(entry);
  });
  const out = new Builder().buildObject({ TransactionList: obj });
  return out;
}

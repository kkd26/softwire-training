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

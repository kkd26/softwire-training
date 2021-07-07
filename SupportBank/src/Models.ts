export type Transaction = {
  narrative: string;
  date: Date;
  amount: number;
  from?: string;
  to?: string;
};

export type JsonEntry = {
  Date: string;
  FromAccount: string;
  ToAccount: string;
  Narrative: string;
  Amount: number;
};

export type XMLEntry = {
  $: { Date: string };
  Description: string[];
  Value: string[];
  Parties: Array<{ From: string[]; To: string[] }>;
};

export class EmptyNameError extends Error {}

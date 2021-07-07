export default interface Transaction {
  narrative: string;
  date: Date;
  amount: number;
  from?: string;
  to?: string;
}

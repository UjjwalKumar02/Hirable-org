export interface Ledger {
  id: string;
  type: "PURCHASE" | "RESERVE" | "USAGE" | "REFUND";
  amount: number;
  previousBalance: number;
  currentBalance: number;
  referenceId: string;
  createdAt: Date;
  userId: string;
}

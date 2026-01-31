
export interface ISystemRecord {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  date: Date;
  source: "SYSTEM";
  createdAt: Date;
}
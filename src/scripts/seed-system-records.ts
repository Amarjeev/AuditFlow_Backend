import "dotenv/config";
import mongoose from "mongoose";
import { systemRecordModel } from "../schema/systemRecord.schema";

const MONGO_URI = process.env.MONGO_URL!;
const TOTAL_RECORDS = 500;

async function seedSystemRecords() {
  await mongoose.connect(MONGO_URI);

  const records = Array.from({ length: TOTAL_RECORDS }, (_, i) => ({
    transactionId: `TXN${1000 + i + 1}`,
    referenceNumber: `REF-${i + 1}`,
    amount: Math.floor(Math.random() * 5000) + 500,
    date: new Date(2024, 11, (i % 28) + 1),
    source: "SYSTEM",
  }));

  await systemRecordModel.insertMany(records);

  process.exit(0);
}

seedSystemRecords().catch(console.error);

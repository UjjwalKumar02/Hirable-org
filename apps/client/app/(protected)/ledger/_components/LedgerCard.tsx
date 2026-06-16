import formatDate from "../../../../lib/helpers/formatDate";
import { Ledger } from "../../../../types/ledger.type";

export default function LedgerCard({ ledger }: { ledger: Ledger }) {
  return (
    <div className="w-full flex justify-between gap-4 border border-gray-200 rounded-md shadow-xs p-7">
      <div className="flex flex-col gap-1.5">
        <p>Type: {ledger.type}</p>
        <p>Amount: {ledger.amount}</p>
        <p>Current balance: {ledger.currentBalance}</p>
        <p>Previous balance: {ledger.previousBalance}</p>
        <p>Reference id: {ledger.referenceId}</p>
      </div>
      <div className="items-end">
        <p>{formatDate(new Date(ledger.createdAt))}</p>
      </div>
    </div>
  );
}

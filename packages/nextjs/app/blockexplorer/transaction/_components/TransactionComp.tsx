"use client";

import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";

const TransactionComp = ({ txHash }: { txHash: string }) => {
  const router = useRouter();

  return (
    <div className="container mx-auto mt-10 mb-20 px-10 md:px-0">
      <button className="btn btn-sm btn-primary" onClick={() => router.back()}>
        Back
      </button>
      <div className="overflow-x-auto">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Transaction Details</h2>
        <div className="rounded-lg bg-base-100 w-full shadow-lg p-6">
          <p className="text-lg mb-4">
            <strong>Transaction Hash:</strong> {txHash}
          </p>
          <p className="text-base text-base-content/70">
            Transaction details are not available in simulation mode. 
            This component requires blockchain interaction to fetch real transaction data.
          </p>
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> To view real transaction details, you need to:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Connect to a blockchain network</li>
              <li>Have the transaction hash from a real transaction</li>
              <li>Use a blockchain explorer or RPC provider</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionComp;

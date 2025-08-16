"use client";

type BalanceProps = {
  address?: string;
  className?: string;
};

/**
 * Display balance for Flow addresses.
 * Note: This is a placeholder component for Flow integration.
 */
export const Balance = ({ address, className = "" }: BalanceProps) => {
  if (!address) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`btn btn-sm btn-ghost flex flex-col font-normal items-center ${className}`}>
      <div className="w-full flex items-center justify-center">
        <span>0.0000</span>
        <span className="text-[0.8em] font-bold ml-1">FLOW</span>
      </div>
      <div className="text-xs text-gray-500">Balance not available</div>
    </div>
  );
};

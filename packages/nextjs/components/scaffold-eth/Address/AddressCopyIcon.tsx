import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const AddressCopyIcon = ({ address, size = "base" }: { address: string; size?: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sizeClasses = {
    "3xs": "h-2.5 w-2.5",
    "2xs": "h-3 w-3",
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    base: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
    xl: "h-[22px] w-[22px]",
    "2xl": "h-6 w-6",
    "3xl": "h-[26px] w-[26px]",
    "4xl": "h-7 w-7",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(address);
      }}
      type="button"
      className="cursor-pointer"
    >
      {isCopied ? (
        <CheckCircleIcon className={sizeClasses[size as keyof typeof sizeClasses]} aria-hidden="true" />
      ) : (
        <DocumentDuplicateIcon className={sizeClasses[size as keyof typeof sizeClasses]} aria-hidden="true" />
      )}
    </button>
  );
};

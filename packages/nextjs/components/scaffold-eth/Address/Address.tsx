"use client";

import { AddressCopyIcon } from "./AddressCopyIcon";

const textSizeMap = {
  "3xs": "text-[10px]",
  "2xs": "text-[11px]",
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;

const copyIconSizeMap = {
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
} as const;

type SizeMap = typeof textSizeMap | typeof copyIconSizeMap;

const getNextSize = <T extends SizeMap>(sizeMap: T, currentSize: keyof T, step = 1): keyof T => {
  const sizes = Object.keys(sizeMap) as Array<keyof T>;
  const currentIndex = sizes.indexOf(currentSize);
  const nextIndex = Math.min(currentIndex + step, sizes.length - 1);
  return sizes[nextIndex];
};

const getPrevSize = <T extends SizeMap>(sizeMap: T, currentSize: keyof T, step = 1): keyof T => {
  const sizes = Object.keys(sizeMap) as Array<keyof T>;
  const currentIndex = sizes.indexOf(currentSize);
  const prevIndex = Math.max(currentIndex - step, 0);
  return sizes[nextIndex];
};

type AddressProps = {
  address?: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  onlyEnsOrAddress?: boolean;
};

export const Address = ({
  address,
  disableAddressLink,
  format = "short",
  size = "base",
  onlyEnsOrAddress = false,
}: AddressProps) => {
  if (!address) {
    return <span className={`${textSizeMap[size]} text-base-content`}>No address</span>;
  }

  // Simple address formatting for Flow addresses
  const displayAddress = format === "short" 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  return (
    <div className="flex items-center gap-1">
      <span className={`${textSizeMap[size]} text-base-content font-mono`}>
        {displayAddress}
      </span>
      <AddressCopyIcon address={address} size={size} />
    </div>
  );
};

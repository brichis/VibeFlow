/**
 * Common utility functions for Scaffold-ETH 2
 */

/**
 * Replacer function for JSON.stringify that handles BigInt and other special types
 */
export const replacer = (key: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "object" && value !== null) {
    if (value.type === "BigNumber") {
      return value.toString();
    }
  }
  return value;
};

/**
 * Format an address for display
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format a number for display
 */
export const formatNumber = (value: string | number | bigint): string => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  return value.toString();
};

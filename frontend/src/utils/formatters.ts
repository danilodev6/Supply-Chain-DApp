// utils/formatters.ts
import { formatEther } from "ethers";

export function formatPrice(value: bigint | number | string): string {
  try {
    // bigint (wei) -> convert to ETH
    if (typeof value === "bigint") {
      const eth = parseFloat(formatEther(value));
      return `${eth.toFixed(4)} ETH`;
    }

    // string
    if (typeof value === "string") {
      if (/^\d+$/.test(value)) {
        const eth = parseFloat(formatEther(BigInt(value)));
        return `${eth.toFixed(4)} ETH`;
      }
      const n = Number(value);
      return Number.isNaN(n) ? "0 ETH" : `${n.toFixed(4)} ETH`;
    }

    // 3) number (ETH)
    return Number.isNaN(value) ? "0 ETH" : `${value.toFixed(4)} ETH`;
  } catch {
    return "0 ETH";
  }
}

export const convertTime = (timestamp: string | number | bigint): string => {
  try {
    // Handle different types of timestamp inputs
    let timeValue: number;

    if (typeof timestamp === "bigint") {
      // Convert BigInt to number - smart contracts often return BigInt
      timeValue = Number(timestamp);
    } else if (typeof timestamp === "string") {
      timeValue = parseInt(timestamp);
    } else {
      timeValue = timestamp;
    }

    // Check if the timestamp is in milliseconds or seconds
    // If it's less than a typical year 2000 timestamp in seconds, assume it's in seconds
    const timestampInMs = timeValue < 10000000000 ? timeValue * 1000 : timeValue;

    const date = new Date(timestampInMs);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  try {
    if (!address || typeof address !== "string") {
      return "Invalid address";
    }

    // If address is shorter than expected format, return as is
    if (address.length <= startChars + endChars) {
      return address;
    }

    // Standard Ethereum address format: 0x + 40 hex characters
    if (address.startsWith("0x") && address.length === 42) {
      return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    }

    // For other formats, just slice from beginning and end
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  } catch (error) {
    console.error("Error formatting address:", error);
    return "Invalid address";
  }
};

export const getStatusText = (status: number): string => {
  const statusNames = ["Pending", "Shipped", "Delivered", "Cancelled"];
  return statusNames[status] || "Unknown";
};

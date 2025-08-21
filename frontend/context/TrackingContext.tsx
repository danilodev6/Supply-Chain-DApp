"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { trackingABI as ContractABI } from "@/constants/contractABI";
// Internal imports
import { contractAddress as ContractAddress } from "@/constants/contractAddress";
import type { shipment } from "@/types/shipment";

// Define the context type interface
interface TrackingContextType {
  DappName: string;
  currentAccount: string | null;
  createShipment: (shipment: shipment) => Promise<void>;
  payForShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
  startShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
  completeShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
  getShipment: (shipmentId: number) => Promise<shipment>;
  getAllShipments: () => Promise<shipment[]>;
  getShipmentsBySender: (sender: string) => Promise<shipment[]>;
  getShipmentsCount: () => Promise<number>;
  connectWallet: () => Promise<string | void>;
}

// Fetching the contract
export const fetchContract = (signerOrProvider: ethers.Signer | ethers.Provider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

// Create context with proper typing and default values
export const TrackingContext = React.createContext<TrackingContextType>({
  DappName: "",
  currentAccount: null,
  createShipment: async () => {
    throw new Error("TrackingContext not initialized");
  },
  payForShipment: async () => {
    throw new Error("TrackingContext not initialized");
  },
  startShipment: async () => {
    throw new Error("TrackingContext not initialized");
  },
  completeShipment: async () => {
    throw new Error("TrackingContext not initialized");
  },
  getShipment: async () => {
    throw new Error("TrackingContext not initialized");
  },
  getAllShipments: async () => {
    throw new Error("TrackingContext not initialized");
  },
  getShipmentsBySender: async () => {
    throw new Error("TrackingContext not initialized");
  },
  getShipmentsCount: async () => {
    throw new Error("TrackingContext not initialized");
  },
  connectWallet: async () => {
    throw new Error("TrackingContext not initialized");
  },
});

export const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
  //State variables
  const DappName = "Tracking Dapp";
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Helper function to get shipment details
  const getShipment = async (shipmentId: number): Promise<shipment> => {
    try {
      if (!currentAccount) {
        throw new Error("Please connect your wallet first");
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const shipment = await contract.getShipment(shipmentId);
      return shipment;
    } catch (error) {
      console.error("Error fetching shipment:", error);
      throw error;
    }
  };

  // Get all shipments - ONLY call this when wallet is connected
  const getAllShipments = async (): Promise<shipment[]> => {
    console.log("Fetching all shipments");
    try {
      if (!currentAccount) {
        console.log("No wallet connected, returning empty array");
        return [];
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);
      const shipments = await contract.getAllShipments();

      return shipments.map((shipment: shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        pickupTime: shipment.pickupTime,
        deliveryTime: shipment.deliveryTime,
        distance: Number(shipment.distance),
        isPaid: shipment.isPaid,
        status: Number(shipment.status),
        price: ethers.formatEther(shipment.price),
      }));
    } catch (error) {
      console.error("Error fetching all shipments:", error);
      return [];
    }
  };

  // Get shipments count for the current sender
  const getShipmentsCount = async (): Promise<number> => {
    try {
      if (!currentAccount) {
        console.log("No wallet connected");
        return 0;
      }

      if (!window.ethereum) {
        console.error("MetaMask is not installed");
        return 0;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);
      const ShipmentsCount = await contract.getShipmentsCountBySender(currentAccount);

      return Number(ShipmentsCount);
    } catch (error) {
      console.error("Error fetching shipments count:", error);
      return 0;
    }
  };

  // Get shipments by sender
  const getShipmentsBySender = async (sender: string): Promise<shipment[]> => {
    try {
      if (!currentAccount) {
        console.log("No wallet connected");
        return [];
      }

      if (!window.ethereum) {
        console.error("MetaMask is not installed");
        return [];
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);
      const shipments = await contract.getShipmentsBySender(sender || currentAccount);

      return shipments.map((shipment: shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        pickupTime: shipment.pickupTime,
        deliveryTime: shipment.deliveryTime,
        distance: Number(shipment.distance),
        isPaid: shipment.isPaid,
        status: Number(shipment.status), // Convert BigInt enum value to number
        price: ethers.formatEther(shipment.price),
      }));
    } catch (error) {
      console.error("Error fetching shipments by sender:", error);
      return [];
    }
  };

  // Create a new shipment ( for sender )
  const createShipment = async (shipment: shipment): Promise<void> => {
    console.log("Creating shipment:", shipment);
    const { receiver, pickupTime, distance, price } = shipment;

    try {
      if (!currentAccount) {
        throw new Error("Please connect your wallet first");
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const createShipmentTx = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.parseEther(price.toString())
      );
      await createShipmentTx.wait();
      console.log("Shipment created successfully: ", createShipmentTx);
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  };

  // Pay for a shipment ( for receiver )
  const payForShipment = async (shipmentId: number): Promise<ethers.ContractTransactionResponse> => {
    console.log("Paying for shipment with ID:", shipmentId);
    try {
      if (!currentAccount) {
        throw new Error("Please connect your wallet first");
      }

      // Get shipment details to know the price
      const shipment = await getShipment(shipmentId);
      const price = shipment.price; // This is already in wei from the contract

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const payShipmentTx = await contract.payForShipment(shipmentId, {
        value: price, // Send the exact price in wei
      });

      await payShipmentTx.wait();
      console.log("Payment successful: ", payShipmentTx);
      return payShipmentTx;
    } catch (error) {
      console.error("Error paying for shipment:", error);
      throw error;
    }
  };

  // Start a shipment ( for sender )
  const startShipment = async (shipmentId: number): Promise<ethers.ContractTransactionResponse> => {
    console.log("Starting shipment with ID:", shipmentId);
    try {
      if (!currentAccount) {
        throw new Error("Please connect your wallet first");
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const startTx = await contract.startShipment(shipmentId);
      await startTx.wait();
      console.log("Shipment started: ", startTx);
      return startTx;
    } catch (error) {
      console.error("Error starting shipment:", error);
      throw error;
    }
  };

  // Complete a shipment ( for receiver )
  const completeShipment = async (shipmentId: number): Promise<ethers.ContractTransactionResponse> => {
    console.log("Completing shipment with ID:", shipmentId);
    try {
      if (!currentAccount) {
        throw new Error("Please connect your wallet first");
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const completeTx = await contract.completeShipment(shipmentId);
      await completeTx.wait();
      console.log("Shipment completed: ", completeTx);
      return completeTx;
    } catch (error) {
      console.error("Error completing shipment:", error);
      throw error;
    }
  };

  // FIXED: This function now only checks for already connected accounts
  const checkAccountConnection = async (): Promise<void> => {
    try {
      if (!window.ethereum) return;

      // Only check for already connected accounts, don't prompt user
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        console.log("Already connected account found:", accounts[0]);
      } else {
        console.log("No connected accounts found");
      }
    } catch (error) {
      console.error("Error checking account connection:", error);
    }
  };

  const connectWallet = async (): Promise<string | void> => {
    try {
      if (!window.ethereum) return "MetaMask is not installed";

      // This is the only place where we should prompt for connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        console.log("Wallet connected:", accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkAccountConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          console.log("Account changed to:", accounts[0]);
        } else {
          setCurrentAccount(null);
          console.log("Account disconnected");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        DappName,
        currentAccount,
        createShipment,
        payForShipment,
        startShipment,
        completeShipment,
        getShipment,
        getAllShipments,
        getShipmentsBySender,
        getShipmentsCount,
        connectWallet,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

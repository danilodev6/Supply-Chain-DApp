"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { trackingABI as ContractABI } from "@/constants/contractABI";
// Internal imports
import { contractAddress as ContractAddress } from "@/constants/contractAddress";

// Shipment type definition
type shipment = {
  sender: string;
  receiver: string;
  pickupTime: string;
  deliveryTime: string;
  distance: number;
  isPaid: boolean;
  status: { pending: boolean; shipped: boolean; delivered: boolean; cancelled: boolean };
  price: number;
};

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
  const DappName = "Product Tracking Dapp";
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Helper function to get shipment details
  const getShipment = async (shipmentId: number): Promise<shipment> => {
    try {
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

  // Get all shipments
  const getAllShipments = async (): Promise<shipment[]> => {
    console.log("Fetching all shipments");
    try {
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
        isPaid: shipment.isPaid,
        status: shipment.status,
        price: ethers.formatEther(shipment.price), // Convert from wei to ether
      }));
    } catch (error) {
      console.error("Error fetching all shipments:", error);
      throw error;
    }
  };

  // Get shipments count for the current sender
  const getShipmentsCount = async (): Promise<number> => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask is not installed");
        return 0;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);
      const ShipmentsCount = await contract.getShipmentsCountBySender(currentAccount);

      return ShipmentsCount;
    } catch (error) {
      console.error("Error fetching shipments count:", error);
      throw error;
    }
  };

  // Get shipments by sender
  const getShipmentsBySender = async (sender: string): Promise<shipment[]> => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask is not installed");
        return [];
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);
      const shipments = await contract.getShipmentsBySender(currentAccount);

      return shipments.map((shipment: shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        pickupTime: shipment.pickupTime,
        deliveryTime: shipment.deliveryTime,
        isPaid: shipment.isPaid,
        status: shipment.status,
        price: ethers.formatEther(shipment.price), // Convert from wei to ether
      }));
    } catch (error) {
      console.error("Error fetching shipments by sender:", error);
      throw error;
    }
  };

  // Create a new shipment ( for sender )
  const createShipment = async (shipment: shipment): Promise<void> => {
    console.log("Creating shipment:", shipment);
    const { receiver, pickupTime, distance, price } = shipment;

    try {
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
      console.error("Error connecting to wallet:", error);
    }
  };

  // Pay for a shipment ( for receiver )
  const payForShipment = async (shipmentId: number): Promise<ethers.ContractTransactionResponse> => {
    console.log("Paying for shipment with ID:", shipmentId);
    try {
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

  const checkAccountConnection = async (): Promise<void> => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking account connection:", error);
      throw error;
    }
  };

  const connectWallet = async (): Promise<string | void> => {
    try {
      if (!window.ethereum) return "MetaMask is not installed";

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkAccountConnection();
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

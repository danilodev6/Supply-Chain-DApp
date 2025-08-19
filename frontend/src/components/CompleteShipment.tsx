import { ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";

export type shipment = {
  sender: string;
  receiver: string;
  pickupTime: string;
  deliveryTime: string;
  distance: number;
  isPaid: boolean;
  status: { pending: boolean; shipped: boolean; delivered: boolean; cancelled: boolean };
  price: number;
};

export interface CompleteShipmentProps {
  completeModal: boolean;
  setCompleteModal: Dispatch<SetStateAction<boolean>>;
  completeShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
}

const CompleteShipment: React.FC<CompleteShipmentProps> = ({ setCompleteModal, completeShipment }) => {
  return <div>Complete Shipment</div>;
};

export default CompleteShipment;

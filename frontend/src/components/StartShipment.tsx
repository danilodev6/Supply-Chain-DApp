import { Dispatch, SetStateAction } from "react";
import { ethers } from "ethers";

// Shipment type (should be shared across your app)
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

// StartShipment component props
export interface StartShipmentProps {
  startModal: boolean;
  setStartModal: Dispatch<SetStateAction<boolean>>;
  startShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
}

const StartShipment: React.FC<StartShipmentProps> = ({ startModal, setStartModal, startShipment }) => {
  return <div>Start Shipmetns</div>;
};

export default StartShipment;

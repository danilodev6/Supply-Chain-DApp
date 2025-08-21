import type { ethers } from "ethers";
import type { Dispatch, SetStateAction } from "react";
import type { shipment } from "@/types/shipment";

export interface CompleteShipmentProps {
  completeModal: boolean;
  setCompleteModal: Dispatch<SetStateAction<boolean>>;
  completeShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
}

const CompleteShipment: React.FC<CompleteShipmentProps> = ({ setCompleteModal, completeShipment }) => {
  return <div>Complete Shipment</div>;
};

export default CompleteShipment;

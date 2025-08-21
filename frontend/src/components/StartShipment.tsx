import type { ethers } from "ethers";
import type { Dispatch, SetStateAction } from "react";
import type { shipment } from "@/types/shipment";

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

import { Dispatch, SetStateAction } from "react";

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

// GetShipment component props
export interface GetShipmentProps {
  getModal: boolean;
  setGetModal: Dispatch<SetStateAction<boolean>>;
  getShipment: (shipmentId: number) => Promise<shipment>;
}

const GetShipment: React.FC<GetShipmentProps> = ({ getModal, setGetModal, getShipment }) => {
  return <div>Get Shipments</div>;
};

export default GetShipment;

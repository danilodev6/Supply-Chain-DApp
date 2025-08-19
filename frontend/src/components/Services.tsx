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

// Services component props
export interface ServicesProps {
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
  setCompleteModal: Dispatch<SetStateAction<boolean>>;
  setGetModal: Dispatch<SetStateAction<boolean>>;
  setStartModal: Dispatch<SetStateAction<boolean>>;
}

const Services: React.FC<ServicesProps> = ({ setOpenProfile, setCompleteModal, setGetModal, setStartModal }) => {
  return <div>Services</div>;
};

export default Services;

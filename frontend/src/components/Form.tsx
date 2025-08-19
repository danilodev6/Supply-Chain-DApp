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

// Form component props
export interface FormProps {
  createShipmentModal: boolean;
  createShipment: (shipment: shipment) => Promise<void>;
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
}

const Form: React.FC<FormProps> = ({ createShipmentModal, createShipment, setCreateShipmentModal }) => {
  return <div>Form</div>;
};

export default Form;

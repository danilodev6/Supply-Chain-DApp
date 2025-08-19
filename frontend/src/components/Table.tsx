import { Dispatch, SetStateAction } from "react";
import React from "react";

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

// Table component props
export interface TableProps {
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
  allShipmentsData: shipment[];
}

const Table: React.FC<TableProps> = ({ setCreateShipmentModal, allShipmentsData }) => {
  return <div>Table</div>;
};

export default Table;

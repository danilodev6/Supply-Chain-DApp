import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { convertTime, formatAddress, formatPrice, getStatusText } from "@/utils/formatters";
import type { shipment } from "../types/shipment";

// Table component props
export interface TableProps {
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
  allShipmentsData: shipment[];
}

const Table: React.FC<TableProps> = ({ allShipmentsData }) => {
  console.log(allShipmentsData);

  return (
    <div className="my-6">
      <h3 className="text-center text-white-base text-3xl mt-8 mb-8">All your shipments</h3>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-stone-base">
          <thead className="bg-white-platinum text-jet-black font-semibold">
            <tr>
              <th className="px-4 py-2">Sender</th>
              <th className="px-4 py-2">Receiver</th>
              <th className="px-4 py-2">Pickup Time</th>
              <th className="px-4 py-2">Distance (km)</th>
              <th className="px-4 py-2">Price ETH</th>
              <th className="px-4 py-2">Delivery Time</th>
              <th className="px-4 py-2">Paid</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {allShipmentsData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-white-base/70">
                  No shipments found
                </td>
              </tr>
            ) : (
              allShipmentsData.map((shipment, index) => (
                <tr key={index} className="border-b bg-white-base">
                  <td className="px-4 py-2">{formatAddress(shipment.sender)}</td>
                  <td className="px-4 py-2">{formatAddress(shipment.receiver)}</td>
                  <td className="px-4 py-2">{convertTime(shipment.pickupTime)}</td>
                  <td className="px-4 py-2">{shipment.distance}</td>
                  <td className="px-4 py-2">{formatPrice(shipment.price)}</td>
                  <td className="px-4 py-2">{convertTime(shipment.deliveryTime)}</td>
                  <td className="px-4 py-2">{shipment.isPaid ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{getStatusText(shipment.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

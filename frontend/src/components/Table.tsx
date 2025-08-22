import type React from "react";
import { convertTime, formatAddress, formatPrice, getStatusText } from "@/utils/formatters";
import type { shipment } from "../types/shipment";

// Table component props
export interface TableProps {
  allShipmentsData: shipment[];
}

const Table: React.FC<TableProps> = ({ allShipmentsData }) => {
  console.log(allShipmentsData);

  return (
    <div className="my-6">
      <h3 className="text-center text-white-base text-3xl mt-8 mb-3">All your shipments</h3>
      <p className="text-xl text-center text-white-base/80 mb-3">(Total count: {allShipmentsData.length})</p>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left text-stone-base">
          <thead className="bg-white-platinum text-jet-black font-semibold">
            <tr>
              <th className="px-4 py-2">Index</th>
              <th className="px-4 py-2">Sender</th>
              <th className="px-4 py-2">Receiver</th>
              <th className="px-4 py-2">Price ETH</th>
              <th className="px-4 py-2">Distance (km)</th>
              <th className="px-4 py-2">Pickup Time</th>
              <th className="px-4 py-2">Delivery Time</th>
              <th className="px-4 py-2">Paid</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {allShipmentsData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-white-base/70">
                  No shipments found
                </td>
              </tr>
            ) : (
              allShipmentsData.map((shipment, index) => (
                <tr key={index} className="border-b bg-white-base">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{formatAddress(shipment.sender)}</td>
                  <td className="px-4 py-2">{formatAddress(shipment.receiver)}</td>
                  <td className="px-4 py-2">{formatPrice(shipment.price)}</td>
                  <td className="px-4 py-2">{shipment.distance} km</td>
                  <td className="px-4 py-2">{convertTime(shipment.pickupTime)}</td>
                  <td className="px-4 py-2">
                    {shipment.deliveryTime === "0" || !shipment.deliveryTime
                      ? "Not delivered yet"
                      : convertTime(shipment.deliveryTime)}
                  </td>
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

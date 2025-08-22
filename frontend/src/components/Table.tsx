import type React from "react";
import { convertTime, formatAddress, formatPrice, getStatusText } from "@/utils/formatters";
import type { shipment } from "../types/shipment";

export interface TableProps {
  allShipmentsData: shipment[];
}

const Table: React.FC<TableProps> = ({ allShipmentsData }) => {
  return (
    <div className="w-full p-6 bg-white-base rounded-lg shadow-lg my-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jet-black">All Shipments</h2>
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {allShipmentsData.length} shipments
        </span>
      </div>

      {allShipmentsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>No shipments found</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
          <p className="text-gray-500">There are no shipments available at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Index</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Receiver</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Distance</th>
                <th className="px-6 py-3">Pickup Time</th>
                <th className="px-6 py-3">Delivery Time</th>
                <th className="px-6 py-3">Paid</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {allShipmentsData.map((shipment, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">{formatAddress(shipment.sender)}</td>
                  <td className="px-6 py-4">{formatAddress(shipment.receiver)}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(shipment.price)}</td>
                  <td className="px-6 py-4">{shipment.distance} km</td>
                  <td className="px-6 py-4">{convertTime(shipment.pickupTime)}</td>
                  <td className="px-6 py-4">
                    {shipment.deliveryTime === "0" || !shipment.deliveryTime
                      ? "Not delivered"
                      : convertTime(shipment.deliveryTime)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shipment.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shipment.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shipment.status === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : shipment.status === 1
                            ? "bg-blue-100 text-blue-800"
                            : shipment.status === 2
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatusText(shipment.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;

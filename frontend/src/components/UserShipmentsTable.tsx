"use client";
import { useEffect, useState } from "react";
import type { shipment } from "@/types/shipment";
import { convertTime, formatAddress, formatPrice, getStatusText } from "@/utils/formatters";

export interface UserShipmentsTableProps {
  currentAccount: string | null;
  getShipmentsBySender: (sender: string) => Promise<shipment[]>;
}

const UserShipmentsTable: React.FC<UserShipmentsTableProps> = ({ currentAccount, getShipmentsBySender }) => {
  const [userShipments, setUserShipments] = useState<shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserShipments = async () => {
      if (!currentAccount) {
        setUserShipments([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Fetching shipments for user:", currentAccount);
        const shipments = await getShipmentsBySender(currentAccount);
        console.log("User shipments:", shipments);
        setUserShipments(shipments);
      } catch (error) {
        console.error("Error fetching user shipments:", error);
        setUserShipments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserShipments();
  }, [currentAccount, getShipmentsBySender]);

  if (!currentAccount) {
    return (
      <div className="w-full p-6 bg-white-base rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-jet-black mb-4">My Shipments</h2>
        <p className="text-gray-500 text-center py-8">Please connect your wallet to view your shipments</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white-base rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-jet-black mb-4">My Shipments</h2>
        <p className="text-gray-500 text-center py-8">Loading your shipments...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white-base rounded-lg shadow-lg my-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jet-black">My Shipments</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Account:</span>
          <span className="text-sm font-medium text-jet-black">{formatAddress(currentAccount)}</span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {userShipments.length} shipments
          </span>
        </div>
      </div>

      {userShipments.length === 0 ? (
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
          <p className="text-gray-500">You haven't created any shipments yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Receiver
                </th>
                <th scope="col" className="px-6 py-3">
                  Pickup Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Distance
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Paid
                </th>
                <th scope="col" className="px-6 py-3">
                  Delivery Time
                </th>
              </tr>
            </thead>
            <tbody>
              {userShipments.map((shipment, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{formatAddress(shipment.receiver)}</td>
                  <td className="px-6 py-4">{convertTime(shipment.pickupTime)}</td>
                  <td className="px-6 py-4">{shipment.distance} km</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(shipment.price)}</td>
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
                    {shipment.deliveryTime === "0" || !shipment.deliveryTime
                      ? "Not delivered"
                      : convertTime(shipment.deliveryTime)}
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

export default UserShipmentsTable;

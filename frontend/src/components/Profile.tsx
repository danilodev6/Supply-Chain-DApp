"use client";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { shipment } from "@/types/shipment";
import { formatAddress } from "@/utils/formatters";

// Profile component props
export interface ProfileProps {
  profileModal: boolean;
  setProfileModal: Dispatch<SetStateAction<boolean>>;
  currentAccount: string | null;
  getShipmentsCount: () => Promise<number>;
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
  getShipmentsBySender: (sender: string) => Promise<shipment[]>;
}

const Profile: React.FC<ProfileProps> = ({
  profileModal,
  setProfileModal,
  setCreateShipmentModal,
  currentAccount,
  getShipmentsCount,
  getShipmentsBySender,
}) => {
  const userAddress = currentAccount ? formatAddress(currentAccount) : "Not connected";
  const [userShipments, setUserShipments] = useState<shipment[]>([]);
  const [shipmentCount, setShipmentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch user shipments count
  useEffect(() => {
    const fetchShipmentCount = async () => {
      if (currentAccount) {
        try {
          console.log("Calling getShipmentsCount...");
          const count = await getShipmentsCount();
          console.log("Retrieved count:", count);
          setShipmentCount(count);
        } catch (error) {
          console.error("Error fetching shipment count:", error);
          setShipmentCount(0);
        }
      } else {
        console.log("No current account, setting count to 0");
        setShipmentCount(0);
      }
    };

    fetchShipmentCount();
  }, [currentAccount, getShipmentsCount, profileModal]);

  // Fetch user shipments
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

  const completedCount = userShipments.filter((s) => s.status === 2).length; // status 2 = completed
  const inProgressCount = userShipments.filter((s) => s.status === 1).length; // status 1 = in transit

  // User balance is the sum of all shipment prices
  const userBalance = userShipments.reduce((acc, s) => acc + Number(s.price), 0).toFixed(4);

  return (
    <div>
      {profileModal ? (
        <div className="fixed inset-0 z-50 overflow-auto">
          <div className="fixed inset-0 w-full h-full bg-jet-black/80"></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-md mx-auto bg-white-base rounded-lg shadow-xl">
              {/* Close button */}
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="p-1 text-stone-base hover:text-stone-base/60 transition-colors"
                  onClick={() => {
                    setProfileModal(false);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 pb-6 text-center">
                <h4 className="text-xl font-semibold text-jet-black mb-2">{formatAddress(userAddress)}</h4>
                <p className="text-gray-500 text-sm mb-6">Connected Wallet</p>

                {/* Modal content */}
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
                  <div className="grid gap-4 text-left">
                    <div className="grid gap-4 text-left">
                      <div>
                        <span className="block text-sm text-gray-500">Shipments</span>
                        <span className="text-lg font-medium text-jet-black">{shipmentCount}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Completed</span>
                        <span className="text-lg font-medium text-green-600">{completedCount}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">In Progress</span>
                        <span className="text-lg font-medium text-blue-600">{inProgressCount}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">ETH Balance</span>
                        <span className="text-lg font-medium text-jet-black">{userBalance} ETH</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full  py-3 px-4 my-3 bg-purple-base hover:bg-white-base hover:text-purple-base hover:border-purple-base shadow-[inset_0_0_0_1px_currentColor] disabled:bg-purple-400 text-white-base font-medium rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setProfileModal(false);
                        setCreateShipmentModal(true);
                      }}
                    >
                      Create Shipment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;

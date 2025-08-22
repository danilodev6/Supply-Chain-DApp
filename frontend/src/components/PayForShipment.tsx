"use client";
import type { ethers } from "ethers";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { shipment } from "@/types/shipment";
import { convertTime, formatAddress, formatPrice, getStatusText } from "@/utils/formatters";

// PayForShipment component props
export interface PayForShipmentProps {
  payModal: boolean;
  setPayModal: Dispatch<SetStateAction<boolean>>;
  payForShipment: (shipmentId: number) => Promise<ethers.ContractTransactionResponse>;
  getShipment: (shipmentId: number) => Promise<shipment>;
}

const PayForShipment: React.FC<PayForShipmentProps> = ({ payModal, setPayModal, payForShipment, getShipment }) => {
  const [index, setIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [singleShipmentData, setSingleShipmentData] = useState<shipment | null>(null);

  const getShipmentHandler = async () => {
    // Basic validation
    if (index < 0) {
      alert("Please enter a valid index");
      return;
    }

    setIsLoading(true);
    try {
      const getData = await getShipment(index);
      setSingleShipmentData(getData);
      console.log(getData);
    } catch (error) {
      console.error("Error fetching shipment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const payShipmentHandler = async () => {
    // Basic validation
    if (!singleShipmentData) {
      alert("Please search for a shipment first");
      return;
    }

    if (singleShipmentData.isPaid) {
      alert("This shipment is already paid for");
      return;
    }

    if (Number(singleShipmentData.status) !== 0) {
      // Not pending
      alert("This shipment cannot be paid for (not in pending status)");
      return;
    }

    setIsLoading(true);
    try {
      const paymentResponse = await payForShipment(index);
      console.log("Payment transaction response:", paymentResponse);
      alert("Payment successful!");
      // Refresh shipment data after payment
      await getShipmentHandler();
    } catch (error) {
      console.error("Error paying for shipment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {payModal ? (
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
                    setPayModal(false);
                    setSingleShipmentData(null);
                    setIndex(0);
                  }} // Reset state on close
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal content */}
              <div className="px-6 pb-6 text-center">
                <h4 className="text-xl font-semibold text-jet-black mb-2">Pay your Product</h4>
                <p className="text-gray-500 text-sm mb-6">Search your product by id to pay</p>

                {/* Form */}
                <div className="space-y-4">
                  {/* Index field */}
                  <div>
                    <input
                      type="number"
                      name="Index"
                      placeholder="index"
                      value={index}
                      onChange={(e) => setIndex(Number(e.target.value))}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Search Shipment button */}
                  <button
                    type="button"
                    onClick={getShipmentHandler}
                    disabled={isLoading}
                    className="w-full bg-purple-base hover:bg-white-base hover:text-purple-base hover:border-purple-base shadow-[inset_0_0_0_1px_currentColor] disabled:bg-purple-400 text-white-base font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? "Searching..." : "Search Shipment"}
                  </button>
                </div>
              </div>

              {/* Display shipment data if available */}
              {singleShipmentData && singleShipmentData.sender !== "0x0000000000000000000000000000000000000000" ? (
                <div className="px-6 pb-6 text-left">
                  <h4 className="text-lg font-semibold text-jet-black mb-2">Shipment Details</h4>
                  <div className="space-y-2 text-sm text-jet-black">
                    <p>
                      <span className="font-semibold">Sender:</span> {formatAddress(singleShipmentData.sender)}
                    </p>
                    <p>
                      <span className="font-semibold">Receiver:</span> {formatAddress(singleShipmentData.receiver)}
                    </p>
                    <p>
                      <span className="font-semibold">Pickup Time:</span> {convertTime(singleShipmentData.pickupTime)}
                    </p>
                    <p>
                      <span className="font-semibold">Delivery Time:</span>{" "}
                      {singleShipmentData.deliveryTime === "0" || !singleShipmentData.deliveryTime
                        ? "Not delivered yet"
                        : convertTime(singleShipmentData.deliveryTime)}
                    </p>

                    <p>
                      <span className="font-semibold">Distance:</span> {singleShipmentData.distance} km
                    </p>
                    <p>
                      <span className="font-semibold">Is paid:</span> {singleShipmentData.isPaid ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span> {getStatusText(singleShipmentData.status)}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> {formatPrice(singleShipmentData.price)}
                    </p>
                  </div>
                  {/* Pay Shipment button */}
                  <button
                    type="button"
                    onClick={payShipmentHandler}
                    disabled={isLoading || singleShipmentData.isPaid || Number(singleShipmentData.status) !== 0}
                    className={`w-full mt-2 font-bold shadow-[inset_0_0_0_1px_currentColor] py-3 px-4 rounded-lg transition-colors duration-200 ${
                      singleShipmentData.isPaid
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-800 hover:bg-white-base hover:text-green-800 hover:border-green-800 text-white-base"
                    }`}
                  >
                    {isLoading
                      ? "Paying..."
                      : singleShipmentData.isPaid
                        ? "Already Paid"
                        : Number(singleShipmentData.status) !== 0
                          ? "Cannot Pay"
                          : "Pay Shipment"}
                  </button>
                </div>
              ) : (
                <p className="px-6 pb-6 text-center text-stone-base">No shipment found with this index</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PayForShipment;

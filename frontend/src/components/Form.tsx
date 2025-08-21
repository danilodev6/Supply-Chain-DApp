"use client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { shipment } from "@/types/shipment";

// Form component props
export interface FormProps {
  createShipmentModal: boolean;
  createShipment: (shipment: shipment) => Promise<void>;
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
}

const Form: React.FC<FormProps> = ({ createShipmentModal, createShipment, setCreateShipmentModal }) => {
  const [shipment, setShipment] = useState({
    receiver: "",
    pickupTime: "",
    distance: 0,
    price: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipment((prev) => ({
      ...prev,
      [name]: name === "distance" || name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const createShipmentHandler = async () => {
    // Basic validation
    if (!shipment.receiver || !shipment.pickupTime || !shipment.distance || !shipment.price) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const fullShipment: shipment = {
        sender: "",
        receiver: shipment.receiver,
        pickupTime: shipment.pickupTime,
        deliveryTime: "",
        distance: shipment.distance,
        price: shipment.price,
        isPaid: false,
        status: 0,
      };

      await createShipment(fullShipment);

      // Reset form
      setShipment({
        receiver: "",
        pickupTime: "",
        distance: 0,
        price: 0,
      });
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Error creating shipment. Please try again.");
    } finally {
      setIsLoading(false);
      setCreateShipmentModal(false);
    }
  };

  return (
    <div>
      {createShipmentModal ? (
        <div className="fixed inset-0 z-50 overflow-auto">
          <div className="fixed inset-0 w-full h-full bg-jet-black/80"></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-md mx-auto bg-white-base rounded-lg shadow-xl">
              {/* Close button */}
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="p-1 text-stone-base hover:text-stone-base/60 transition-colors"
                  onClick={() => setCreateShipmentModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal content */}
              <div className="px-6 pb-6 text-center">
                <h4 className="text-xl font-semibold text-jet-black mb-2">Track product, Create Shipment</h4>
                <p className="text-gray-500 text-sm mb-6">You can create your shipment following this form</p>

                {/* Form */}
                <div className="space-y-4">
                  {/* Receiver field */}
                  <div>
                    <input
                      type="text"
                      name="receiver"
                      placeholder="receiver"
                      value={shipment.receiver}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Pickup time field */}
                  <div>
                    <input
                      type="date"
                      name="pickupTime"
                      placeholder="dd/mm/yyyy"
                      value={shipment.pickupTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Distance field */}
                  <div>
                    <input
                      type="number"
                      name="distance"
                      placeholder="distance"
                      value={shipment.distance === 0 ? "" : shipment.distance}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Price field */}
                  <div>
                    <input
                      type="number"
                      name="price"
                      placeholder="price"
                      value={shipment.price === 0 ? "" : shipment.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Create Shipment button */}
                  <button
                    type="button"
                    onClick={createShipmentHandler}
                    disabled={isLoading}
                    className="w-full bg-purple-base hover:bg-white-base hover:text-purple-base hover:border-purple-base shadow-[inset_0_0_0_1px_currentColor] disabled:bg-purple-400 text-white-base font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? "Creating..." : "Create Shipment"}
                  </button>
                </div>
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

export default Form;

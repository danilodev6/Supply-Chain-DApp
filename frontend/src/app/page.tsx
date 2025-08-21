"use client";
import { useContext, useEffect, useState } from "react";
import { TrackingContext } from "@/../context/TrackingContext";
import { CompleteShipment, Form, GetShipment, Profile, Services, StartShipment, Table } from "@/components/index";

// Import the shipment type from your context file
type shipment = {
  sender: string;
  receiver: string;
  pickupTime: string;
  deliveryTime: string;
  distance: number;
  isPaid: boolean;
  status: { pending: boolean; shipped: boolean; delivered: boolean; cancelled: boolean };
  price: number;
};

export default function Home() {
  const context = useContext(TrackingContext);
  const {
    DappName,
    currentAccount,
    createShipment,
    payForShipment,
    startShipment,
    completeShipment,
    getShipment,
    getAllShipments,
    getShipmentsBySender,
    getShipmentsCount,
    connectWallet,
  } = context;

  const [createShipmentModal, setCreateShipmentModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModal, setGetModal] = useState(false);

  // Data State Variables - properly typed
  const [allShipmentsData, setAllShipmentsData] = useState<shipment[]>([]);
  const [loading, setLoading] = useState(false);

  // FIXED: Only fetch shipments when wallet is connected
  useEffect(() => {
    const fetchAllShipments = async () => {
      // Only fetch if wallet is connected
      if (!currentAccount) {
        console.log("No wallet connected, skipping shipment fetch");
        setAllShipmentsData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching shipments for connected account:", currentAccount);
        const allData = await getAllShipments();
        setAllShipmentsData(allData);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setAllShipmentsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllShipments();
  }, [currentAccount, getAllShipments]);

  return (
    <div className="mt-40 md:mt-20">
      <div className="flex mb-5 md:mb-10 flex-col justify-between text-center items-center px-4 py-2">
        <h1 className="text-center text-white-base text-3xl">Track your supplies</h1>

        {!currentAccount && (
          <div className="text-center p-4">
            <p className="text-white-platinum/60">
              Please connect your wallet using the button in the top navigation to view shipments
            </p>
          </div>
        )}
      </div>

      <Services
        setCreateShipmentModal={setCreateShipmentModal}
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModal={setGetModal}
        setStartModal={setStartModal}
      />

      <Table allShipmentsData={allShipmentsData} />

      <Form
        createShipmentModal={createShipmentModal}
        createShipment={createShipment}
        setCreateShipmentModal={setCreateShipmentModal}
      />

      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentAccount={currentAccount}
        getShipmentsCount={getShipmentsCount}
      />

      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
      />

      <GetShipment getModal={getModal} setGetModal={setGetModal} getShipment={getShipment} />

      <StartShipment startModal={startModal} setStartModal={setStartModal} startShipment={startShipment} />

      {currentAccount && (
        <div>
          {loading ? (
            <div>Loading shipments...</div>
          ) : (
            <div>
              <p>Total shipments: {allShipmentsData.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

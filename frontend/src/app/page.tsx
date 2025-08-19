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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllShipments = async () => {
      try {
        setLoading(true);
        const allData = await getAllShipments();
        setAllShipmentsData(allData);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllShipments();
  }, [getAllShipments]);

  return (
    <>
      <h1>Hello, Next.js!</h1>
      <div>Home</div>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModal={setGetModal}
        setStartModal={setStartModal}
      />
      <Table setCreateShipmentModal={setCreateShipmentModal} allShipmentsData={allShipmentsData} />
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
      {loading ? (
        <div>Loading shipments...</div>
      ) : (
        <div>
          <p>Total shipments: {allShipmentsData.length}</p>
        </div>
      )}
    </>
  );
}

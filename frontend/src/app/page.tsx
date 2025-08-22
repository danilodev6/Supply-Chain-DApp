"use client";
import { useContext, useEffect, useState } from "react";
import { TrackingContext } from "@/../context/TrackingContext";
import {
  CompleteShipment,
  Form,
  GetShipment,
  PayForShipment,
  Profile,
  Services,
  StartShipment,
  Table,
  UserShipmentsTable,
} from "@/components/index";
import type { shipment } from "@/types/shipment";

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
  const [profileModal, setProfileModal] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const [payModal, setPayModal] = useState(false);

  // Data State Variables - properly typed
  const [allShipmentsData, setAllShipmentsData] = useState<shipment[]>([]);
  const [loading, setLoading] = useState(false);

  // Only fetch shipments when wallet is connected
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
        <h1 className="text-center text-white-base text-3xl">Manage your Supplies</h1>

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
        setProfileModal={setProfileModal}
        setCompleteModal={setCompleteModal}
        setGetModal={setGetModal}
        setStartModal={setStartModal}
        setPayModal={setPayModal}
      />

      <Table allShipmentsData={allShipmentsData} />

      <UserShipmentsTable getShipmentsBySender={getShipmentsBySender} currentAccount={currentAccount} />

      <Form
        createShipmentModal={createShipmentModal}
        createShipment={createShipment}
        setCreateShipmentModal={setCreateShipmentModal}
      />

      <PayForShipment
        payModal={payModal}
        setPayModal={setPayModal}
        payForShipment={payForShipment}
        getShipment={getShipment}
      />

      <Profile
        profileModal={profileModal}
        setProfileModal={setProfileModal}
        setCreateShipmentModal={setCreateShipmentModal}
        currentAccount={currentAccount}
        getShipmentsCount={getShipmentsCount}
        getShipmentsBySender={getShipmentsBySender}
      />

      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
        getShipment={getShipment}
      />

      <GetShipment getModal={getModal} setGetModal={setGetModal} getShipment={getShipment} />

      <StartShipment
        startModal={startModal}
        setStartModal={setStartModal}
        startShipment={startShipment}
        getShipment={getShipment}
      />
    </div>
  );
}

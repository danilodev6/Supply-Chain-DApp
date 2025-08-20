import { Dispatch, SetStateAction } from "react";

// Shipment type (should be shared across your app)
export type shipment = {
  sender: string;
  receiver: string;
  pickupTime: string;
  deliveryTime: string;
  distance: number;
  isPaid: boolean;
  status: { pending: boolean; shipped: boolean; delivered: boolean; cancelled: boolean };
  price: number;
};

// Services component props
export interface ServicesProps {
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
  setCompleteModal: Dispatch<SetStateAction<boolean>>;
  setGetModal: Dispatch<SetStateAction<boolean>>;
  setStartModal: Dispatch<SetStateAction<boolean>>;
}

const Services: React.FC<ServicesProps> = ({ setOpenProfile, setCompleteModal, setGetModal, setStartModal }) => {
  const serviceCards = [
    {
      id: 1,
      title: "Create Shipment",
      description: "Create a new shipping order",
      icon: "📦",
      action: () => {
        console.log("Create Shipment clicked");
      },
    },
    {
      id: 2,
      title: "View Profile",
      description: "Check your shipping profile",
      icon: "👤",
      action: () => setOpenProfile(true),
    },
    {
      id: 3,
      title: "Get Shipment",
      description: "Track a specific shipment",
      icon: "🔍",
      action: () => setGetModal(true),
    },
    {
      id: 4,
      title: "Start Shipment",
      description: "Begin shipment delivery",
      icon: "🚀",
      action: () => setStartModal(true),
    },
    {
      id: 5,
      title: "Complete Shipment",
      description: "Mark shipment as delivered",
      icon: "✅",
      action: () => setCompleteModal(true),
    },
    {
      id: 6,
      title: "All Shipments",
      description: "View all your shipments",
      icon: "📋",
      action: () => {
        console.log("All Shipments clicked");
      },
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-10 w-[80%] mx-auto text-center">
      {serviceCards.map((card) => (
        <button
          type="button"
          key={card.id}
          onClick={card.action}
          className="bg-white-base rounded-lg px-8 py-10 hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl mb-4">{card.icon}</div>
          <h3 className="text-jet-black text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-stone-base text-sm">{card.description}</p>
        </button>
      ))}
    </div>
  );
};

export default Services;

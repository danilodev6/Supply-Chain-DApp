import type { Dispatch, SetStateAction } from "react";

// Services component props
export interface ServicesProps {
  setCreateShipmentModal: Dispatch<SetStateAction<boolean>>;
  setProfileModal: Dispatch<SetStateAction<boolean>>;
  setCompleteModal: Dispatch<SetStateAction<boolean>>;
  setGetModal: Dispatch<SetStateAction<boolean>>;
  setStartModal: Dispatch<SetStateAction<boolean>>;
  setPayModal: Dispatch<SetStateAction<boolean>>;
}

const Services: React.FC<ServicesProps> = ({
  setCreateShipmentModal,
  setProfileModal,
  setCompleteModal,
  setGetModal,
  setStartModal,
  setPayModal,
}) => {
  const serviceCards = [
    {
      id: 1,
      title: "Create Shipment",
      description: "Create a new shipping order",
      action: () => {
        setCreateShipmentModal(true);
      },
    },
    {
      id: 2,
      title: "Start Shipment",
      description: "Begin shipment delivery",
      action: () => setStartModal(true),
    },
    {
      id: 3,
      title: "Complete Shipment",
      description: "Mark shipment as delivered",
      action: () => setCompleteModal(true),
    },
    {
      id: 4,
      title: "Pay For Shipment",
      description: "Pay your shipping fees",
      action: () => setPayModal(true),
    },
    {
      id: 5,
      title: "Get Shipment",
      description: "Track a specific shipment",
      action: () => setGetModal(true),
    },
    {
      id: 6,
      title: "View Profile",
      description: "Check your shipping profile",
      action: () => setProfileModal(true),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-y-3 md:gap-10 w-[80%] mx-auto text-center">
      {serviceCards.map((card) => (
        <button
          type="button"
          key={card.id}
          onClick={card.action}
          className="bg-white-base rounded-lg px-8 py-14 hover:scale-105 transition-all duration-300"
        >
          <h3 className="text-jet-black text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-stone-base text-sm">{card.description}</p>
        </button>
      ))}
    </div>
  );
};

export default Services;

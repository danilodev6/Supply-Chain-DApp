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

// Profile component props
export interface ProfileProps {
  openProfile: boolean;
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
  currentAccount: string | null;
  getShipmentsCount: () => Promise<number>;
}

const Profile: React.FC<ProfileProps> = ({ openProfile, setOpenProfile, currentAccount, getShipmentsCount }) => {
  return <div>Profile</div>;
};

export default Profile;

import type { Dispatch, SetStateAction } from "react";
import type { shipment } from "@/types/shipment";

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

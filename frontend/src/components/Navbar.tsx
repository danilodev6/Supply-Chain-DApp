"use client";
import { useContext } from "react";
import { TrackingContext } from "../../context/TrackingContext";

const Navbar = () => {
  const { currentAccount, DappName, connectWallet } = useContext(TrackingContext);

  return (
    <nav className="fixed w-full mx-auto md:px-42 top-0 flex flex-col md:flex-row gap-y-6 justify-between place-items-center my-10 z-50">
      <div className="text-sm md:text-xl text-purple-base font-bold bg-white-base rounded-lg px-4 py-3">{DappName}</div>
      <div className="text-sm md:text-md text-gray-500">
        {currentAccount ? (
          <span className="text-white-base px-4 py-3 bg-purple-base rounded-lg">
            Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => connectWallet()}
            className="bg-purple-base text-white-base px-4 py-3 rounded-lg hover:bg-white-base hover:text-purple-base transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

"use client";
import { useContext, useState } from "react";
import { TrackingContext } from "../../context/TrackingContext";

const MenuHamb = () => {
  const navItems = [
    { name: "Home", path: "#home" },
    { name: "Services", path: "#services" },
    { name: "Contact us", path: "#contact" },
    { name: "Erc20", path: "#erc20" },
  ];

  const { currentAccount, DappName, connectWallet } = useContext(TrackingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 md:px-20 gap-x-4 flex flex-col md:flex-row gap-4 justify-between items-center my-10 md:my-10 md:mx-16 z-50">
      {/* Botón siempre visible */}
      <div className="text-sm md:text-xl text-purple-base font-bold bg-white-base rounded-lg px-4 py-3">{DappName}</div>
      <div className="text-sm md:text-md text-gray-500">
        {currentAccount ? (
          <span className="text-white-base px-4 py-3-purple-base rounded-lg">
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
      <button
        type="button"
        onClick={toggleMenu}
        className="fixed top-10 right-10 z-50 w-12 h-12 bg-stone-base text-white-base rounded-xl flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? "x" : "≡"}
      </button>

      {/* Menú full-screen */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white-base text-jet-black2 z-40 flex items-center justify-center">
          <ul className="flex flex-col items-center space-y-8 text-2xl">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  onClick={toggleMenu}
                  className="hover:bg-purple-base hover:text-white-base px-4 py-2 rounded-lg"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MenuHamb;

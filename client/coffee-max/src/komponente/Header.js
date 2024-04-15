import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "../../context/CartContext";
import Logo from "./Logo";

export default function Header() {
  const { totalQuantities, totalPrice } = useCart();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const popupRef = useRef();

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeLoginPopup();
      }
    };

    if (isLoginPopupOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isLoginPopupOpen]);

  return (
    <header className="sticky top-0 bg-white z-10 shadow">
      <div className="container mx-auto p-6 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-4">
          <Link href="/korpa" className="relative flex items-center space-x-1 text-gray-700 hover:text-gray-900">
            <div className="relative">
              <ShoppingCartIcon className="w-7 h-7 flex-shrink-0" />
            </div>
            <p className="text-lg">
              {totalPrice} RSD{" "}
              <span className="text-sm text-gray-500">({totalQuantities})</span>
            </p>
          </Link>
          <button onClick={openLoginPopup} className="text-gray-700 hover:text-gray-900 cursor-pointer">
            Prijavi se
          </button>
          {isLoginPopupOpen && (
            <div ref={popupRef} className="absolute top-16 right-4 w-72 p-4 bg-white border shadow-md z-20 hover:shadow-lg">
              <p className="w-full text-center mb-2">
                <Link href="/login" onClick={closeLoginPopup}>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
                    Prijavi se
                  </button>
                </Link>
              </p>
              <p className="w-full text-center">
                Nemate nalog?{" "}
                <Link href="/register" onClick={closeLoginPopup}>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
                    Registruj se
                  </button>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "../../context/CartContext";
import Logo from "./Logo";

export default function Header() {
  const { totalQuantities, totalPrice } = useCart();

  return (
    <header className="sticky top-0 bg-white z-10 shadow">
      <div className="container mx-auto p-6 flex justify-between ">
        <Logo />
        <Link href="/korpa" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
          <div className="relative">
            <ShoppingCartIcon className="w-7 h-7 flex-shrink-0" />
          </div>
          <p className="text-lg">
            {totalPrice} RSD{" "}
            <span className="text-sm text-gray-500">({totalQuantities})</span>
          </p>
        </Link>
      </div>
    </header>
  );
}
import React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from '../../context/CartContext';

const inter = Inter({
  subsets: ['latin-ext'],
  variable: "--font-inter-"
});

const Korpa = () => {
  const { onAdd, totalPrice, totalQuantities, cartItems, onRemove } = useCart();

  return (
    <div className={`${inter.variable} container xl:max-w-screen-xl mx-auto py-12 px-6`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Korpa</h2>
        <p className="text-lg text-gray-600">
          Ukupno: {totalPrice} RSD ({totalQuantities} proizvoda)
        </p>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Korpa je prazna.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 shadow-md rounded-lg flex items-center">
              <img className="w-24 h-24 rounded-lg shadow-md mr-4" src={item.Slike} alt="Product" />
              <div>
                <h3 className="text-lg font-semibold">{item.Naziv}</h3>
                <p className="text-gray-600">Cena: {item.cena}</p>
                <button onClick={() => onAdd(item, -1)}>-</button>{" "}
                <p className="text-gray-600">Količina: {item.quantity}</p>{" "}
                <button onClick={() => onAdd(item, 1)}>+</button>
              </div>
              <button onClick={() => onRemove(item)}>izbrisi</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/placanje">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            Plaćanje
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Korpa;

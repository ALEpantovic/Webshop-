import React, { useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useCart } from '../../context/CartContext';

const inter = Inter({
  subsets: ['latin-ext'],
  variable: "--font-inter-"
});

const placanje = () => {
  const { cartItems, totalPrice, totalQuantities } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`${inter.variable} container xl:max-w-screen-xl mx-auto py-12 px-6`}>
      <h2 className="text-2xl font-semibold mb-4">Plaćanje</h2>
      <div className="bg-white p-6 shadow-md rounded-lg">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ime i prezime
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email adresa
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Adresa za dostavu
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Kontakt telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Zavrsi kupovinu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default placanje;

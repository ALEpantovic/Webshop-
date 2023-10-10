import React from "react";
import { Inter } from "next/font/google";
import Header from "./Header";
import Footer from "./Footer";
import Metadata from "./Metadata";
import {CartProvider } from '../../context/CartContext'
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin-ext"],
  variable: "--font-inter-",
});

const AppLayout = ({ children }) => {
  return (
    <CartProvider>
      <div className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Metadata />
        <Header />
        <main className="flex-grow bg-[#f7f7f7]">{children}</main>
        <Footer />
        <Toaster />
      </div>
    </CartProvider>
  );
};

export default AppLayout;

import AppLayout from 'src/komponente/Layout'
import React from 'react';
import 'src/styles/globals.css'
import {CartProvider } from '../../context/CartContext'
import { Toaster } from 'react-hot-toast';
import { AuthContexProvider } from '../../context/AuthContext';
export default function App({ Component, pageProps }) {
  return (
    <AuthContexProvider> <CartProvider> <AppLayout><Component {...pageProps}/><Toaster/></AppLayout></CartProvider></AuthContexProvider>
  )
}

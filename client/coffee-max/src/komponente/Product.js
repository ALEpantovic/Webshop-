import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {useCart} from '../../context/CartContext'
const Product = ({product}) => {
  const { onAdd } = useCart();
  return (
    <div className="border-2 rounded-md mb-5 group overflow-hidden block"> 
       <div className="relative w-full bg-white">
          <Link href={`/product/${product.id}`}>
            <img src={product.Slike} alt={product.Naziv} className="object-cover w-full h-full border-b-2 border-gray-300"/>
          </Link>
    </div>
    <div>
      <div className="p-6 h-full bg-white flex flex-col justify-between">
       <div className="h-full"> <h2 className="font-semibold text-lg">{product.Naziv}</h2></div>
        <div className="fill h-full float flex-grow mt-4 flex items-center justify-between space-x-2">
          <div>
            <p className="text-gray-500">Cena</p>
            <p className="text-lg font-semibold">{product.cena} RSD</p>
          </div>
            <button onClick={() => onAdd(product,1)} className="border rounded-lg py-1 px-4">
              Dodaj u korpu
            </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Product;
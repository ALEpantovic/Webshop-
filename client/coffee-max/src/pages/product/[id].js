import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCart } from "../../../context/CartContext";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [productList, setProductList] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const { onAdd } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8800/test");
        setProductList(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchProductDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/test/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    
    if (id) {
      fetchProducts();
      fetchProductDetail();
    }
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex w-full max-w-screen-lg">
        <div className="w-1/2 pr-8">
          <img className="w-full h-auto rounded-lg shadow-md" src={product.Slike} alt="Product" />
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-4">{product.Naziv}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{product.Opis}</p>
          <span className="text-green-600 text-lg font-semibold">{product.cena}</span>
          <button onClick={() => onAdd(product,1)} className="border rounded-lg py-1 px-4">
            Dodaj u korpu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
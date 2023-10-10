import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Product from 'src/komponente/Product'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:8800/test");
        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/test/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container xl:max-w-screen-xl mx-auto py-12 px-6'>
        <div className='grid gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
            {products.map(product=>(
              <Product product={product} key={product.id}/>
            ))}
        </div>
    </div>
  );
}


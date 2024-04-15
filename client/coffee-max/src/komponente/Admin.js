import React, { useEffect, useState } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: 'http://localhost:8800',
});

function AdminPage() {
 const [products, setProducts] = useState([]);
 const [isAdmin, setIsAdmin] = useState(false);
 const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
 const [editedProduct, setEditedProduct] = useState(null);
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
      window.location.href = "/";
      return;
    }

    setIsLoading(true);
    axiosInstance.get('/backend/get-role', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => {
      const userRole = response.data.userRole;
      setIsAdmin(userRole === 'administrator');
    }).catch((error) => {
      setError('Error getting user role');
    }).finally(() => {
      setIsLoading(false);
    });

    axiosInstance.get('/api/products').then((response) => {
      setProducts(response.data);
    }).catch((error) => {
      setError('Error fetching products');
    }).finally(() => {
      setIsLoading(false);
    });
 }, []);

 const deleteProduct = (productId) => {
    setIsLoading(true);
    axiosInstance.delete(`/api/admin/products/${productId}`)
      .then(() => {
        axiosInstance.get('/api/products').then((response) => {
          setProducts(response.data);
        });
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        setError('Error deleting product');
      })
      .finally(() => {
        setIsLoading(false);
      });
 };

 const createProduct = () => {
    setIsLoading(true);
    const newProductData = {
      Naziv: 'New Product Name',
      Proizvodjac: 'New Manufacturer',
      Tip_Kafe: 'New Coffee Type',
      Vrsta_Kafe: 'New Coffee Variety',
      Opis: 'New Product Description',
      cena: 5,
      Slike: 'URL_TO_IMAGE',
    };

    axiosInstance.post('/api/admin/products', newProductData)
      .then(() => {
        axiosInstance.get('/api/products').then((response) => {
          setProducts(response.data);
        });
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        setError('Error creating product');
      })
      .finally(() => {
        setIsLoading(false);
      });
 };

 const updateProduct = () => {
    setIsLoading(true);
    const updatedProductData = {
      Naziv: editedProduct.Naziv,
      Proizvodjac: editedProduct.Proizvodjac,
      Tip_kafe: editedProduct.Tip_kafe,
      Vrsta_kafe: editedProduct.Vrsta_kafe,
      Opis: editedProduct.Opis,
      cena: Number(editedProduct.cena)
    };

    axiosInstance.put(`/api/admin/products/${editedProduct.id}`, updatedProductData)
      .then(() => {
        axiosInstance.get('/api/products').then((response) => {
          setProducts(response.data);
        });
        closeEditPopup();
      })
      .catch((error) => {
        console.error('Error updating product:', error);
        setError('Error updating product');
      })
      .finally(() => {
        setIsLoading(false);
      });
 };

 const openEditPopup = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditedProduct(productToEdit);
    setIsEditPopupVisible(true);
 };

 const closeEditPopup = () => {
    setIsEditPopupVisible(false);
 };

 const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
 };

 return (
    <div className="container mx-auto p-4">
      {isLoading && <div>Loading...</div>}
      {isAdmin && (
        <div>
          <h2 className="text-xl mt-4 font-semibold">Product List</h2>
          <button
            onClick={createProduct}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mb-2"
          >
            Create Product
          </button>
          <table className="table-auto mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Naziv</th>
                <th className="px-4 py-2">cena</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                 <td className="border px-4 py-2">{product.id}</td>
                 <td className="border px-4 py-2">{product.Naziv}</td>
                 <td className="border px-4 py-2">{product.cena}</td>
                 <td className="border px-4 py-2">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEditPopup(product.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" >
                        Edit
                      </button>
                   </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
{isEditPopupVisible && editedProduct && (
 <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={updateProduct}>
        <div className="mb-4">
          <label htmlFor="Naziv" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="Naziv"
            id="Naziv"
            value={editedProduct.Naziv}
            onChange={handleEditInputChange}
            placeholder="Product Name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Proizvodjac" className="block text-sm font-medium text-gray-700">Manufacturer</label>
          <input
            type="text"
            name="Proizvodjac"
            id="Proizvodjac"
            value={editedProduct.Proizvodjac}
            onChange={handleEditInputChange}
            placeholder="Manufacturer"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor=" Tip_Kafe" className="block text-sm font-medium text-gray-700">Tip Kafe</label>
          <input
            type="text"
            name=" Tip_Kafe"
            id=" Tip_Kafe"
            value={editedProduct.Tip_Kafe}
            onChange={handleEditInputChange}
            placeholder=" Tip_Kafe"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Vrsta_Kafe" className="block text-sm font-medium text-gray-700">Vrsta_Kafe</label>
          <input
            type="text"
            name="Vrsta_Kafe"
            id="Vrsta_Kafe"
            value={editedProduct.Vrsta_Kafe}
            onChange={handleEditInputChange}
            placeholder="Vrsta_Kafe"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Opis" className="block text-sm font-medium text-gray-700">Opis</label>
          <input
            type="text"
            name="Opis"
            id="Opis"
            value={editedProduct.Opis}
            onChange={handleEditInputChange}
            placeholder="Opis"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cena" className="block text-sm font-medium text-gray-700">cena</label>
          <input
            type="text"
            name="cena"
            id="cena"
            value={editedProduct.cena}
            onChange={handleEditInputChange}
            placeholder="cena"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeEditPopup}
            className="bg-gray-400 text-white px-2 py-1 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
 </div>
)}
        {error && <div className="text-red-500">{error}</div>}
      </div>
   );
  }
  
  export default AdminPage;
  
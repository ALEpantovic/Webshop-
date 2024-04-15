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

  useEffect(() => {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
      window.location.href = "/";
      return;
    }

    axiosInstance.get('/backend/get-role', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => {
      const userRole = response.data.userRole;
      setIsAdmin(userRole === 'administrator');
    }).catch((error) => {
      setError('Error getting user role');
    });

    axiosInstance.get('/test').then((response) => {
      setProducts(response.data);
    }).catch((error) => {
      setError('Error fetching products');
    });
  }, []); 
  const deleteProduct = (productId) => {
    axios.delete(`http://localhost:8800/test/${productId}`).then(() => {
      axios.get('http://localhost:8800/api/products').then((response) => {
        setProducts(response.data);
      });
    });
  };

  const createProduct = () => {
    const newProductData = {
      Naziv: 'New Product Name',
      Proizvodjac: 'New Manufacturer', 
      Tip_Kafe: 'New Coffee Type', 
      Vrsta_Kafe: 'New Coffee Variety', 
      Opis: 'New Product Description',
      cena: 0, 
      Slike: 'URL_TO_IMAGE',
    };
  
    axios.post('http://localhost:8800/api/admin/products', newProductData).then(() => {
      axios.get('http://localhost:8800/api/products').then((response) => {
        setProducts(response.data);
      });
    });
  };
  

  const updateProduct = () => {

    const updatedProductData = {
      Naziv: editedProduct.Naziv,
      Proizvodjac: editedProduct.Proizvodjac,
      Tip_kafe: editedProduct.Tip_kafe,
      Vrsta_kafe: editedProduct.Vrsta_kafe,
      Opis: editedProduct.Opis,
      cena: Number(editedProduct.cena)
    };
  
    axios.put(`http://localhost:8800/api/admin/products/${editedProduct.id}`, updatedProductData)
      .then(() => {
        axiosInstance.get('/api/products').then((response) => {
          setProducts(response.data);
        });
        closeEditPopup();
      })
      .catch((error) => {
        console.error('Greska u izmeni proizvoda:', error);
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
                      onClick={() => openEditPopup(product.id)} // Open the edit popup
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Product Popup */}
      {isEditPopupVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="Naziv" className="block mb-1">Naziv:</label>
                    <input
                      type="text"
                      id="Naziv"
                      name="Naziv"
                      value={editedProduct.Naziv}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="Proizvodjac" className="block mb-1">Proizvodjac:</label>
                    <input
                      type="text"
                      id="Proizvodjac"
                      name="Proizvodjac"
                      value={editedProduct.Proizvodjac}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="Tip_kafe" className="block mb-1">Tip kafe:</label>
                    <input
                      type="text"
                      id="Tip_kafe"
                      name="Tip_kafe"
                      value={editedProduct.Tip_kafe}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="Vrsta_kafe" className="block mb-1">Vrsta kafe:</label>
                    <input
                      type="text"
                      id="Vrsta_kafe"
                      name="Vrsta_kafe"
                      value={editedProduct.Vrsta_kafe}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="Opis" className="block mb-1">Opis:</label>
                    <textarea
                      id="Opis"
                      name="Opis"
                      value={editedProduct.Opis}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="cena" className="block mb-1">cena:</label>
                    <input
                      type="number"
                      id="cena"
                      name="cena"
                      value={editedProduct.cena}
                      onChange={handleEditInputChange}
                      className="w-full px-2 py-1 border rounded"
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
                      type="button"
                      onClick={updateProduct}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </div>
  );
}

export default AdminPage;

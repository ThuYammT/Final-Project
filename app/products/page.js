"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProductClick = () => {
    router.push("/products/create");
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete product");
        }

        alert("Product deleted successfully!");
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
          <button
            className="py-2 px-4 bg-black text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform"
            onClick={handleAddProductClick}
          >
            + Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative group bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg overflow-hidden"
            >
              <img
                src={product.image || "/placeholder-image.png"}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                <p className="text-md text-gray-600">Model: {product.model}</p>
                <p className="text-md text-gray-700 font-semibold mt-2">${product.price.toFixed(2)}</p>
              </div>

              {/* Hover Effect for Smaller Buttons */}
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex justify-around">
                <button
                  className="py-1 px-3 bg-black text-white rounded-lg shadow-md text-sm hover:bg-gray-700 transition"
                  onClick={() => openProductDetails(product)}
                >
                  See Details
                </button>
                <button
                  className="py-1 px-3 bg-black text-white rounded-lg shadow-md text-sm hover:bg-gray-700 transition"
                  onClick={() => router.push(`/products/${product._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="py-1 px-3 bg-black text-white rounded-lg shadow-md text-sm hover:bg-gray-700 transition"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
            <p className="text-lg text-gray-700 mb-2">Category: {selectedProduct.category}</p>
            <p className="text-lg text-gray-700 mb-2">Model: {selectedProduct.model}</p>
            <p className="text-lg text-gray-700 mb-6">Price: ${selectedProduct.price.toFixed(2)}</p>
            <p className="text-lg text-gray-700 mb-6">Description: {selectedProduct.description}</p> {/* Added Description */}
            <img
              src={selectedProduct.image || "/placeholder-image.png"}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover mb-4"
            />
            <button
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

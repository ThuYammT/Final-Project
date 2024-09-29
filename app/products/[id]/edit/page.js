"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // For fetching params

export default function EditProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = useParams(); // Use dynamic ID from the URL

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      alert("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={product?.name || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            value={product?.category || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="price"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            value={product?.price || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="model"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Model
          </label>
          <input
            type="text"
            name="model"
            value={product?.model || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            value={product?.description || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={product?.image || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

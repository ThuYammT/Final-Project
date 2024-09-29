"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    model: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/products"); // Redirect to products page after successful addition
      } else {
        console.error("Failed to add product");
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-black">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            step="0.01" // Allows decimal prices
            placeholder="Price"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            value={formData.model}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            className="w-full mb-4 p-2 border rounded text-black" // Added text-black here
            value={formData.image}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

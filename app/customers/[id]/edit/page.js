"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditCustomerPage() {
  const { id } = useParams(); // Get customer id from the route
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch customer details by id
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch customer");
        }
        const customer = await res.json();
        setFormData({
          name: customer.name,
          email: customer.email,
          address: customer.address,
          phoneNumber: customer.phoneNumber,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading customer data:", error);
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  // Handle form submission to update customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/customers");
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-black text-3xl font-bold mb-4">Edit Customer</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="text-black border-black w-full mb-4 p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="text-black border-black w-full mb-4 p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="text-black border-black w-full mb-4 p-2 border rounded"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="text-black border-black w-full mb-4 p-2 border rounded"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update Customer
          </button>
        </form>
      </div>
    </div>
  );
}

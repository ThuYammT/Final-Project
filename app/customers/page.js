"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]); // State to store fetched customers
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to handle customer details modal
  const router = useRouter();

  // Fetch customers from the backend API
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setCustomers(data); // Set the customers in the state
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }
    fetchCustomers(); // Call the function when the component mounts
  }, []);

  const handleAddCustomerClick = () => {
    router.push("/customers/create"); // Navigate to the "create customer" page
  };

  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      try {
        // Correct the DELETE request to include the customer ID in the URL
        const res = await fetch(`/api/customers/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
  
        if (res.ok) {
          alert("Customer deleted successfully!");
          setCustomers(customers.filter((customer) => customer._id !== id)); // Remove the customer from the local state
        } else {
          throw new Error("Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer. Please try again.");
      }
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-[#f6d365] to-[#fda085] min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-lg">Our Customers</h1>
          <button
            className="py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform"
            onClick={handleAddCustomerClick}
          >
            + Add New Customer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm leading-normal text-gray-600 uppercase">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Address</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{customer.name}</td>
                  <td className="py-4 px-6">{customer.email}</td>
                  <td className="py-4 px-6">{customer.address}</td>
                  <td className="py-4 px-6">{customer.phoneNumber}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() => router.push(`/customers/${customer._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteCustomer(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
              <h2 className="text-3xl font-bold mb-6">{selectedCustomer.name}</h2>
              <p className="text-xl text-gray-700 mb-4">Email: {selectedCustomer.email}</p>
              <p className="text-xl text-gray-700 mb-4">Address: {selectedCustomer.address}</p>
              <p className="text-xl text-gray-700 mb-4">Phone: {selectedCustomer.phoneNumber}</p>
              <button
                className="w-full py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

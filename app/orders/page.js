"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For editing order
  const [editQuantity, setEditQuantity] = useState({}); // For tracking edited quantities
  const [updatedTotal, setUpdatedTotal] = useState(0); // Updated total after quantity change
  const router = useRouter();

  // Fetch all orders from the backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Order deleted successfully!");
          setOrders(orders.filter((order) => order._id !== id));
        } else {
          throw new Error("Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
      }
    }
  };

  // Handle showing the edit modal
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    const initialQuantities = {};
    order.products.forEach((product) => {
      initialQuantities[product.productId?._id] = product.quantity;
    });
    setEditQuantity(initialQuantities);

    // Calculate the total based on initial quantities
    const initialTotal = order.products.reduce(
      (sum, product) => sum + product.productId.price * product.quantity,
      0
    );
    setUpdatedTotal(initialTotal);
  };

  // Handle quantity change and update total
  const handleQuantityChange = (productId, newQuantity, price) => {
    const newQuantities = {
      ...editQuantity,
      [productId]: parseInt(newQuantity, 10),
    };
    setEditQuantity(newQuantities);

    // Calculate the updated total
    const newTotal = selectedOrder.products.reduce((sum, product) => {
      const quantity = newQuantities[product.productId._id] || product.quantity;
      return sum + product.productId.price * quantity;
    }, 0);
    setUpdatedTotal(newTotal);
  };

  // Handle updating the order quantity and price
  const handleUpdateOrder = async () => {
    const updatedProducts = selectedOrder.products.map((product) => ({
      productId: product.productId?._id,
      quantity: editQuantity[product.productId?._id] || product.quantity,
    }));

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: selectedOrder.customerId?._id,
          products: updatedProducts,
          total: updatedTotal, // Include the updated total price
        }),
      });

      if (res.ok) {
        alert("Order updated successfully!");
        setSelectedOrder(null);
        const updatedOrder = await res.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      alert("Error updating order, please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      {/* Header with Dashboard Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Orders</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-all"
        >
          Go to Dashboard
        </button>
      </div>

      {/* Display orders in table format */}
      {orders.length === 0 ? (
        <p className="text-lg text-gray-700">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-left">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Total Price</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{order.orderId}</td>
                  <td className="py-4 px-6">{order.customerId?.name || "Unknown Customer"}</td>
                  <td className="py-4 px-6">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside">
                      {order.products.map((product, index) => (
                        <li key={index}>
                          {product.productId?.name || "Unknown Product"} (Quantity: {product.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() => handleEditOrder(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for editing order quantity */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Order: {selectedOrder.orderId}</h2>
            <ul className="list-disc list-inside mb-4">
              {selectedOrder.products.map((product) => (
                <li key={product.productId._id} className="text-gray-800 mb-2">
                  {product.productId.name}: 
                  <input
                    type="number"
                    value={editQuantity[product.productId._id] || product.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(product.productId._id, e.target.value, product.productId.price)
                    }
                    className="ml-2 p-2 border rounded"
                  />
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-gray-900 mb-4">Updated Total: ${updatedTotal.toFixed(2)}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdateOrder}
              >
                Update
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

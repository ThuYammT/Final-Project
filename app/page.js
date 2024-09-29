"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [products, setProducts] = useState([]); // List of products
  const [cart, setCart] = useState([]); // Products added to the cart
  const [customers, setCustomers] = useState([]); // List of customers for dropdown
  const [selectedCustomer, setSelectedCustomer] = useState(""); // Selected customer ID
  const [selectedProduct, setSelectedProduct] = useState(null); // For product details modal
  const [total, setTotal] = useState(0); // Total amount of the cart
  const [checkoutSuccess, setCheckoutSuccess] = useState(false); // Checkout success state
  const router = useRouter();

  // Fetch products from the backend API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Fetch customers for dropdown selection
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }
    fetchCustomers();
  }, []);

  // Add product to the cart
  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.productId === product._id);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity }]);
    }
  };

  // Calculate total cost
  useEffect(() => {
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, [cart]);

  // Handle checkout with customer validation and order ID generation
  const handleCheckout = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer before checking out.");
      return;
    }

    // Generate a random order ID
    const orderId = `ORDER-${Math.floor(Math.random() * 1000000)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer,
          products: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          total,
          orderId,
        }),
      });

      if (res.ok) {
        setCheckoutSuccess(true); // Show success modal
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleEdit = (productId) => {
    const newQuantity = prompt("Enter new quantity:");
    if (newQuantity && !isNaN(newQuantity)) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: parseInt(newQuantity) }
            : item
        )
      );
    }
  };

  const handleDelete = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  return (
    <div className="container mx-auto py-10 bg-white"> {/* Main background is white */}

      {/* Top Bar with Title, Buttons, and Cart */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-6">
          <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-lg">XO Tech Zone</h1>
          <button
            onClick={() => router.push("/products")}
            className="py-2 px-4 bg-black text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform"
          >
            Go to Products
          </button>
          <button
            onClick={() => router.push("/customers")}
            className="py-2 px-4 bg-black text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform"
          >
            Go to Customers
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="py-2 px-4 bg-black text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform"
          >
            Go to Orders
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Product List */}
        <div className="w-3/4 pr-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 bg-white hover:shadow-lg"
              >
                <img
                  src={product.image || "/placeholder-image.png"}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-lg font-medium text-gray-700">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-gray-800 text-white px-2 py-1 text-sm rounded hover:bg-gray-900 transition-all"
                    onClick={() => setSelectedProduct(product)}
                  >
                    See Details
                  </button>
                  <button
                    className="bg-gray-800 text-white px-2 py-1 text-sm rounded hover:bg-gray-900 transition-all"
                    onClick={() => addToCart(product, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Cart Summary on the Right */}
        <div className="w-1/4 bg-black p-6 fixed right-0 top-0 bottom-0 overflow-auto shadow-lg border-l"> {/* Cart column is black */}
          <h2 className="text-2xl font-bold text-white mb-6">Your Cart</h2>

          {/* Customer Dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-white">Select Customer:</label>
            <select
  className="w-full p-2 border border-gray-300 rounded text-black" // Ensure text-black class is added
  value={selectedCustomer}
  onChange={(e) => setSelectedCustomer(e.target.value)}
>
  <option value="" className="text-black">Choose a customer...</option>
  {customers.map((customer) => (
    <option key={customer._id} value={customer._id} className="text-black">
      {customer.name}
    </option>
  ))}
</select>

          </div>

          {cart.length === 0 ? (
            <p className="text-white">Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center my-4">
                  <p className="text-white">
                    {item.name} x {item.quantity}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 text-sm rounded hover:bg-yellow-600 transition-all"
                      onClick={() => handleEdit(item.productId)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600 transition-all"
                      onClick={() => handleDelete(item.productId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-right text-xl font-bold text-white">Total: ${total.toFixed(2)}</div>
              <button
                className="bg-purple-600 text-white px-4 py-2 mt-6 rounded w-full hover:bg-purple-700 transition-all"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <img
              src={selectedProduct.image || "/placeholder-image.png"}
              alt={selectedProduct.name}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h3>
            <p className="text-lg font-semibold text-gray-900">${selectedProduct.price.toFixed(2)}</p>
            <p className="text-gray-800 mb-4">{selectedProduct.description}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Order Successful!</h2>
            <p className="text-gray-700 mb-6">Your order has been placed successfully.</p>
            <div className="flex justify-between">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-all"
                onClick={() => router.push("/orders")}
              >
                Check Order
              </button>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-all"
                onClick={() => setCheckoutSuccess(false)}
              >
                Still Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const [products, setProducts] = useState([]); // List of products
  const [cart, setCart] = useState([]); // Products added to the cart
  const [selectedProduct, setSelectedProduct] = useState(null); // For product details modal
  const [total, setTotal] = useState(0); // Total amount of the cart
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

  // Add product to the cart
  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.productId === product._id);

    if (existingProduct) {
      // Update quantity if product already exists in the cart
      const updatedCart = cart.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new product to the cart
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity }]);
    }
  };

  // Calculate total cost
  useEffect(() => {
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, [cart]);

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "CUSTOMER_ID", // Replace with logged-in customer's ID
          products: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          total,
        }),
      });

      if (res.ok) {
        alert("Order placed successfully!");
        setCart([]); // Clear the cart
        router.push("/orders/confirmation"); // Navigate to confirmation page
      } else {
        console.error("Failed to place order");
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 flex">
      {/* Product List */}
      <div className="w-3/4 pr-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Order Your Products</h1>

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
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-lg font-medium text-gray-700">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>

              <div className="mt-4 flex justify-between">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                  onClick={() => setSelectedProduct(product)}
                >
                  See Details
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
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
      <div className="w-1/4 bg-white p-6 fixed right-0 top-0 bottom-0 overflow-auto shadow-lg border-l">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-700">Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between my-4">
                <p className="text-gray-900">
                  {item.name} x {item.quantity}
                </p>
                <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="text-right text-xl font-bold text-gray-900">Total: ${total.toFixed(2)}</div>
            <button
              className="bg-purple-600 text-white px-4 py-2 mt-6 rounded w-full hover:bg-purple-700 transition-all"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
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
    </div>
  );
}

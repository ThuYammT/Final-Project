'use client';

export default function CreateOrderPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const body = {
      customerId: formData.get('customerId'),
      products: formData.get('products').split(',').map((id) => id.trim()), // Assume comma-separated product IDs
      total: formData.get('total'),
    };

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="customerId" placeholder="Customer ID" required />
      <input name="products" placeholder="Product IDs (comma separated)" required />
      <input name="total" placeholder="Total Amount" required />
      <button type="submit">Create Order</button>
    </form>
  );
}

import dbConnect from "@/lib/db";
import Order from "@/models/order";

// PUT: Update an existing order
export async function PUT(req, { params }) {
  await dbConnect();
  
  const { id } = params; // Dynamic route param to identify order
  const { products, customerId, total } = await req.json();

  if (!products || !customerId || !total) {
    return new Response(JSON.stringify({ message: 'Missing fields for update' }), { status: 400 });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { products, customerId, total },
      { new: true }
    ).populate("customerId", "name").populate("products.productId", "name price");

    if (!updatedOrder) {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    console.error("Failed to update order:", error);
    return new Response(JSON.stringify({ message: 'Failed to update order' }), { status: 500 });
  }
}

// DELETE: Delete an existing order
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params; // Dynamic route param to identify order

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return new Response(JSON.stringify({ message: 'Failed to delete order' }), { status: 500 });
  }
}

// GET: Fetch order by ID (optional if you need to get order details by ID)
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const order = await Order.findById(id)
      .populate("customerId", "name")
      .populate("products.productId", "name price");
    if (!order) {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return new Response(JSON.stringify({ message: 'Failed to fetch order' }), { status: 500 });
  }
}

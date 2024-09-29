import dbConnect from "@/lib/db";
import Order from "@/models/order";

// POST: Create a new order
export async function POST(req) {
  await dbConnect();

  try {
    const { customerId, products, total, orderId } = await req.json();

    // Check if all required fields are provided
    if (!customerId || !products || products.length === 0 || !total || !orderId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Validate if customerId is valid (You can add more validation as needed)
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response(
        JSON.stringify({ message: "Invalid customer ID" }),
        { status: 400 }
      );
    }

    // Validate if products are provided correctly
    if (!Array.isArray(products) || products.some(p => !p.productId || !p.quantity)) {
      return new Response(
        JSON.stringify({ message: "Invalid products data" }),
        { status: 400 }
      );
    }

    // Create a new order in the database
    const newOrder = new Order({
      customerId,
      products,
      total,
      orderId,
      status: "Pending",
    });

    await newOrder.save();
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create order" }),
      { status: 500 }
    );
  }
  
}
export async function GET(req) {
  await dbConnect();

  try {
    const orders = await Order.find({})
      .populate("customerId", "name") // Populate customer name
      .populate("products.productId", "name price"); // Populate product details

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new Response("Failed to fetch orders", { status: 500 });
  }
}
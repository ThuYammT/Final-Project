import dbConnect from "@/lib/db";
import Order from "@/models/order";

// POST: Create a new order
export async function POST(req) {
  await dbConnect();

  try {
    const { customerId, products, total } = await req.json();

    if (!customerId || !products || products.length === 0 || !total) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newOrder = new Order({
      customerId,
      products,
      total,
      status: "Pending",
    });

    await newOrder.save();
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return new Response("Failed to create order", { status: 500 });
  }
}

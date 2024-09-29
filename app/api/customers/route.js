import dbConnect from "@/lib/db";
import Customer from "@/models/customer";

// GET: List all customers
export async function GET() {
  await dbConnect();

  try {
    const customers = await Customer.find({});
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return new Response("Failed to fetch customers", { status: 500 });
  }
}

// POST: Create a new customer
export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, address, phoneNumber } = await req.json();

    if (!name || !email || !address || !phoneNumber) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newCustomer = new Customer({
      name,
      email,
      address,
      phoneNumber,
    });

    await newCustomer.save();
    return new Response(JSON.stringify(newCustomer), { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return new Response("Failed to create customer", { status: 500 });
  }
}

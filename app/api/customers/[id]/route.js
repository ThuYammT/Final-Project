import dbConnect from "@/lib/db";
import Customer from "@/models/customer";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch customer", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { name, email, address, phoneNumber } = await req.json();
  try {
    const customer = await Customer.findByIdAndUpdate(params.id, { name, email, address, phoneNumber }, { new: true });
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    return new Response("Failed to update customer", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    await dbConnect(); // Ensure database connection
    const { id } = params; // Extract the customer ID from params
  
    try {
      // Find and delete the customer by ID
      const customer = await Customer.findByIdAndDelete(id);
  
      if (!customer) {
        return new Response("Customer not found", { status: 404 }); // Handle case when the customer is not found
      }
  
      return new Response("Customer deleted successfully", { status: 200 }); // Successful deletion
    } catch (error) {
      console.error("Failed to delete customer:", error);
      return new Response("Failed to delete customer", { status: 500 }); // General error handler
    }
  }

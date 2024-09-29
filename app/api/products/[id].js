import dbConnect from '@/lib/db';
import Product from '@/models/product';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params; // Get the product ID from the URL parameters
  try {
    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching product' }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params; // Get the product ID from the URL parameters
  const updatedData = await req.json(); // Get the updated data from the request body
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating product' }), { status: 500 });
  }
}

import dbConnect from '@/lib/db';
import Product from '@/models/product';

// GET: Fetch specific product by ID
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params; // Dynamic route params

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

// PUT: Update product by ID
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params; // Dynamic route params
  const updatedData = await req.json(); // Get updated data from the request body

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

// DELETE: Delete product by ID
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting product' }), { status: 500 });
  }
}

import dbConnect from '@/lib/db';
import Product from '@/models/product';

// POST: Create a new product
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  // Ensure 'model' field is present in the body (replaced 'stock' with 'model')
  const { name, price, category, model, description, image } = body;

  // Validate fields
  if (!name || !price || !category || !model || !description || !image) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  const product = new Product({ name, price, category, model, description, image });
  await product.save();
  return new Response(JSON.stringify(product), { status: 201 });
}

// GET: Fetch all products
export async function GET(req) {
  await dbConnect();
  const products = await Product.find({});
  return new Response(JSON.stringify(products), { status: 200 });
}

// GET BY ID: Fetch a product by ID
export async function GET_BY_ID(req) {
  await dbConnect();
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(product), { status: 200 });
}

// DELETE: Delete a product by ID
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();
  const result = await Product.deleteOne({ _id: id });
  if (result.deletedCount === 1) {
    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
  }
}

// PUT: Update product by ID
export async function PUT(req) {
  await dbConnect();
  const { id, ...updatedData } = await req.json(); // Use destructuring to get ID and updated data
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

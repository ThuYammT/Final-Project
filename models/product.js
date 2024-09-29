import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  model: { type: String, required: true }, // New field for product model
  description: { type: String, required: true },
  image: { type: String, required: true }, // Field for the image URL
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // New field
}, { timestamps: true }); // To automatically manage createdAt and updatedAt fields

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

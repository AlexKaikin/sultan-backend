import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number },
    title: { type: String, required: true },
    sizeType: {type: String, required: true},
    size: {type: String, required: true},
    code: {type: Number, required: true},
    maker: { type: String, required: true },
    brand: {type: String, required: true},
    text: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    quantity: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: Array },
    subSubCategory: { type: Array },
    created: { type: String },
    updated: {type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }
)

export default mongoose.model('Product', ProductSchema)

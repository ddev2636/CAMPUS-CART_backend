import mongoose from "mongoose";
// import User from "../../authService/models/User.js";
const ThingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This refers to the User model
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Electronics", "Books", "Utensils", "Cycles", "Others"],
    default: "Books",
  },
  contact: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Thing", ThingSchema);

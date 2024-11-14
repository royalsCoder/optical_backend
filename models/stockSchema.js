const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["lens", "frame"],
    required: true,
  },
  modelNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sellQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// ============================================================

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;

const mongoose = require("mongoose");

// ============================================================
// FOR OPTICAL

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  number: {
    type: String,
  },
  date: {
    type: String,
  },
  email: {
    type: String,
  },
  dob: {
    type: String,
  },
  OdRightSphDv: {
    type: String,
  },
  OdRightcylDv: {
    type: String,
  },
  OdRightAxisDv: {
    type: String,
  },
  OdRightVADV: {
    type: String,
  },
  OsLeftSphDv: {
    type: String,
  },
  OsLeftCylDv: {
    type: String,
  },
  OsLeftAxisDv: {
    type: String,
  },
  OsLeftVaDv: {
    type: String,
  },
  OdRightNvAdd: {
    type: String,
  },
  OdRightVaNvAdd: {
    type: String,
  },
  OsLeftNvAdd: {
    type: String,
  },
  OsLeftVaNvAdd: {
    type: String,
  },
  instruction: {
    type: String,
  },
  lens: {
    type: String,
  },
  frame: {
    type: String,
  },
  frameModelNumber: {
    type: String,
  },
  Advance: {
    type: String,
  },
  total: {
    type: String,
  },
  balance: {
    type: String,
  },
  Qty: {
    type: String,
  },
  ModeOfPayment: {
    type: String,
  },
  LensModelNumber: {
    type: String,
  },
  Address: {
    type: String,
  },
  lensqyt: {
    type: String,
  },
  lensprice: {
    type: String,
  },
  frameQyt: {
    type: String,
  },
  frameprice: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
});

// ============================================================

const users = new mongoose.model("data", userSchema);
module.exports = users;

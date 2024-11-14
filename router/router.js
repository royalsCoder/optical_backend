const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = require("../models/userSchema");
const moment = require("moment");

const admin = require("../models/signUpSchema");

const Stock = require("../models/stockSchema");

const { v4: uuidv4 } = require("uuid");

// ===============================================================
// FOR OPTICAL SOFTWARE

router.post("/register", async (req, res) => {
  // console.log(req.body);

  const {
    name,
    Address,
    LensModelNumber,
    age,
    number,
    date,
    email,
    dob,
    OdRightSphDv,
    OdRightcylDv,
    OdRightAxisDv,
    OdRightVADV,
    OsLeftSphDv,
    OsLeftCylDv,
    OsLeftAxisDv,
    OsLeftVaDv,
    OdRightNvAdd,
    OdRightVaNvAdd,
    OsLeftNvAdd,
    OsLeftVaNvAdd,
    instruction,
    lens,
    frame,
    frameModelNumber,
    Advance,
    total,
    balance,
    Qty,
    ModeOfPayment,
    lensqyt,
    lensprice,
    frameQyt,
    frameprice,
  } = req.body;

  if (!name) {
    res.status(422).json("plz fill all  data");
  }

  try {
    const userCount = await users.countDocuments();
    const invoiceNumber = String(userCount + 1).padStart(5, "0"); // Format the invoice number with leading zeros

    const adduser = new users({
      name,
      age,
      Address,
      LensModelNumber,
      number,
      date,
      email,
      dob,
      OdRightSphDv,
      OdRightcylDv,
      OdRightAxisDv,
      OdRightVADV,
      OsLeftSphDv,
      OsLeftCylDv,
      OsLeftAxisDv,
      OsLeftVaDv,
      OdRightNvAdd,
      OdRightVaNvAdd,
      OsLeftNvAdd,
      OsLeftVaNvAdd,
      instruction,
      lens,
      frame,
      frameModelNumber,
      Advance,
      total,
      balance,
      Qty,
      ModeOfPayment,
      lensqyt,
      lensprice,
      frameQyt,
      frameprice,
      invoiceNumber,
    });
    await adduser.save();
    res.status(201).json("useradd");
    // console.log(adduser);

    // }
  } catch (error) {
    res.status(422).json(error);
  }
});

// ==================================================================

// get user data

router.get("/getdata", async (req, res) => {
  try {
    let { page, limit, searchQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10; // default limit is 10

    const skip = (page - 1) * limit;

    let query = {};

    // Check if searchQuery exists and add search functionality
    if (searchQuery) {
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { number: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalCount = await users.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const preuser1 = await users
      .find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: preuser1,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });

    // console.log(preuser1);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get single user data

router.get("/getuser/:id", async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const userindividual = await users.findById({ _id: id });
    // console.log(userindividual);
    res.status(201).json(userindividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update data

router.patch("/updateuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateduser = await users.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log(updateduser);
    res.status(201).json(updateduser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete user data

router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteuser = await users.findByIdAndDelete({ _id: id });
    // console.log(deleteuser);
    res.status(201).json(deleteuser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// for adminlogin

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    res.status(422).json("plz fill all  data");
  }

  try {
    const preuser = await admin.findOne({ email: email });
    // console.log(preuser);
    if (preuser) {
      res.status(422).json("user alreDY PRESENT");
    } else {
      const adduser = new admin({
        name,
        email,
        password,
        cpassword,
      });
      await adduser.save();
      res.status(201).json("useradd");
      // console.log(adduser);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

router.post("/signin", async (req, res) => {
  let token;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "enter data" });
  }

  try {
    const userLogin = await admin.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // authoenticayion

      token = await userLogin.generateAuthToken();
      // console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        return res.status(422).json({ error: "invalid crediential" });
      } else {
        const data12 = await admin.find();
        res.status(200).json({
          message: " user login succesfuly",
          token: token,
        });
      }
    } else {
      res.status(400).json({ error: "invalid crediential" });
    }
    // console.log(userLogin);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET data and income for a specific date range

router.get("/custom", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Please provide start and end dates" });
    }

    // Find data within the specified date range
    const customData = await users.find({
      date: {
        $gte: startDate,
        $lte: endDate, // Adjusted to include the end date
      },
    });

    // Calculate total income considering the advance
    const customIncome = calculateTotalIncome(customData);

    // Return the data and calculated income
    res.status(200).json({
      data: customData,
      income: customIncome,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to calculate total income from the given data, considering advance
function calculateTotalIncome(data) {
  let totalIncome = 0;
  try {
    data.forEach((entry) => {
      // Convert total and advance to floats
      // const total = parseFloat(entry.total);
      const advance = parseFloat(entry.Advance);

      // Check if advance is a valid number
      // if (!isNaN(advance)) {
      // Subtract advance from total to get the effective income
      totalIncome += advance;
      // } else {
      // console.error("Invalid advance value:", entry.Advance);
      // }
    });
  } catch (error) {
    console.error("Error occurred while calculating income:", error);
  }
  return totalIncome;
}

router.get("/birthday", async (req, res) => {
  try {
    const todayUsers = await users.find();

    // Filter users whose birthday is today
    const matchedUsers = todayUsers.filter((user) => {
      return (
        new Date(user.dob).getDate() === new Date().getDate() &&
        1 + new Date(user.dob).getMonth() === 1 + new Date().getMonth()
      );
    });

    res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("Error fetching users with birthday today:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get('/records/year', async (req, res) => {
  try {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    // Fetch all users
    const allUsers = await users.find();

    // Filter users whose date is exactly 1 year ago
    const matchedUsers = allUsers.filter((user) => {
      const userDate = new Date(user.date);
      return (
        userDate.getFullYear() === oneYearAgo.getFullYear() &&
        userDate.getMonth() === oneYearAgo.getMonth() &&
        userDate.getDate() === oneYearAgo.getDate()
      );
    });

    res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("Error fetching users with date exactly 1 year ago:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const { lens, frame, frameModelNumber } = req.query;

    // Build the query object based on the provided filters
    let query = {};
    if (lens) query.lens = lens;
    if (frame) query.frame = frame;
    if (frameModelNumber) query.frameModelNumber = frameModelNumber;

    const filteredData = await users.find(query);

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new stock item
router.post("/addStock", async (req, res) => {
  const { itemName, category, modelNumber, quantity, price } = req.body;

  if (!itemName || !category || !modelNumber || !quantity || !price) {
    return res.status(422).json("Please fill all the data");
  }

  try {
    const newStock = new Stock({
      itemName,
      category,
      modelNumber,
      quantity,
      price,
    });

    await newStock.save();
    res.status(201).json("Stock item added successfully");
  } catch (error) {
    console.error("Error adding stock item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete Stock data

router.delete("/deleteStock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteuser = await Stock.findByIdAndDelete({ _id: id });
    
    res.status(201).json(deleteuser);
  } catch (error) {
    res.status(422).json(error);
  }
});





router.get("/quantity-range", async (req, res) => {
  try {
    const stocks = await Stock.find({
      quantity: { $gt: 1, $lt: 8 }
    });

    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stock items found in the specified quantity range" });
    }

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stock quantity

router.patch("/updatestock1/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateduser = await Stock.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log(updateduser);
    res.status(201).json(updateduser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// Update stock for both lens and frame
router.patch("/updateStock", async (req, res) => {
  const { lensId, frameId, lensQuantity, frameQuantity } = req.body;

  if (
    lensId === undefined ||
    frameId === undefined ||
    lensQuantity === undefined ||
    frameQuantity === undefined
  ) {
    return res
      .status(422)
      .json(
        "Please provide all required fields: lensId, frameId, lensQuantity, frameQuantity"
      );
  }

  // Convert quantities to numbers
  const lensQuantityNumber = Number(lensQuantity);
  const frameQuantityNumber = Number(frameQuantity);

  if (isNaN(lensQuantityNumber) || isNaN(frameQuantityNumber)) {
    return res.status(422).json("Invalid quantity values. Must be numbers.");
  }

  try {
    // Retrieve the lens item
    const lensItem = await Stock.findById(lensId);
    if (!lensItem || lensItem.category !== "lens") {
      return res.status(404).json({ error: "Lens item not found" });
    }

    // Check if the lens item is out of stock
    if (lensItem.quantity === 0 || lensItem.quantity < 0) {
      return res.status(400).json({ error: "Lens item is out of stock" });
    }

    // Check if the lens quantity  is out of stock
    if (lensItem.quantity < lensQuantityNumber) {
      return res
        .status(400)
        .json({ error: `you have only ${lensItem.quantity} Lens in stock!` });
    }

    // Retrieve the frame item
    const frameItem = await Stock.findById(frameId);
    if (!frameItem || frameItem.category !== "frame") {
      return res.status(404).json({ error: "Frame item not found" });
    }

    // Check if the frame item is out of stock
    if (frameItem.quantity === 0 || frameItem.quantity < 0) {
      return res.status(400).json({ error: "Frame item is out of stock" });
    }
    // Check if the lens quantity  is out of stock
    if (frameItem.quantity < frameQuantityNumber) {
      return res.status(400).json({
        error: ` you have only  ${frameItem.quantity} frameItem in stock!`,
      });
    }

    // Update the lens item
    const updatedLensQuantity = lensItem.quantity - lensQuantityNumber;
    lensItem.quantity = updatedLensQuantity;
    lensItem.sellQuantity += lensQuantityNumber; // Accumulate sellQuantity
    await lensItem.save();

    // Update the frame item
    const updatedFrameQuantity = frameItem.quantity - frameQuantityNumber;
    frameItem.quantity = updatedFrameQuantity;
    frameItem.sellQuantity += frameQuantityNumber; // Accumulate sellQuantity
    await frameItem.save();

    res
      .status(201)
      .json({ message: "Stock updated successfully", lensItem, frameItem });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all frame
router.get("/getframes", async (req, res) => {
  try {
    // Query to find all stock items where the category is "frame"
    const frame = await Stock.find({ category: "frame" });

    // Return the results to the client
    res.status(200).json(frame);
  } catch (error) {
    console.error("Error fetching frame:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all lenses
router.get("/getLenses", async (req, res) => {
  try {
    // Query to find all stock items where the category is "lens"
    const lenses = await Stock.find({ category: "lens" });

    // Return the results to the client
    res.status(200).json(lenses);
  } catch (error) {
    console.error("Error fetching lenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all stock items
router.get("/getStock", async (req, res) => {
  try {
    const stockItems = await Stock.find();
    res.status(200).json(stockItems);
  } catch (error) {
    console.error("Error fetching stock items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

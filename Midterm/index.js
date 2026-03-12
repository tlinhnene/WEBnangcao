const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3002;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;
let categoriesCollection;
let productsCollection;
let employeesCollection;
let customersCollection;
let ordersCollection;
let orderDetailsCollection;

async function connectDB() {
  await client.connect();

  db = client.db("MickeyStoreDB");

  categoriesCollection = db.collection("Category");
  productsCollection = db.collection("Product");
  employeesCollection = db.collection("Employee");
  customersCollection = db.collection("Customer");
  ordersCollection = db.collection("Order");
  orderDetailsCollection = db.collection("OrderDetails");

  console.log("Connected MongoDB");
}

app.get("/", (req, res) => {
  res.send("Mickey Store Backend Running");
});

/* =========================
   CATEGORY CRUD
========================= */

// GET all categories
app.get("/categories", async (req, res) => {
  try {
    const data = await categoriesCollection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one category by Mongo _id
app.get("/categories/:id", async (req, res) => {
  try {
    const data = await categoriesCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!data) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST category
app.post("/categories", async (req, res) => {
  try {
    const result = await categoriesCollection.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT category
app.put("/categories/:id", async (req, res) => {
  try {
    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
app.delete("/categories/:id", async (req, res) => {
  try {
    const result = await categoriesCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   PRODUCT CRUD + SEARCH + SORT
========================= */

// GET all products with filter and sort
app.get("/products", async (req, res) => {
  try {
    let query = {};
    let sort = {};

    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const categoryId = req.query.categoryId;
    const sortPrice = req.query.sortPrice;

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (sortPrice === "asc") {
      sort.price = 1;
    } else if (sortPrice === "desc") {
      sort.price = -1;
    }

    const data = await productsCollection.find(query).sort(sort).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one product by productId
app.get("/products/:id", async (req, res) => {
  try {
    const data = await productsCollection.findOne({
      productId: req.params.id,
    });

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST product
app.post("/products", async (req, res) => {
  try {
    const result = await productsCollection.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT product by productId
app.put("/products/:id", async (req, res) => {
  try {
    const result = await productsCollection.updateOne(
      { productId: req.params.id },
      { $set: req.body }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product by productId
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({
      productId: req.params.id,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   LOGIN
========================= */

// customer login
app.post("/customers/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await customersCollection.findOne({ email, password });

    if (!customer) {
      return res.status(401).json({ message: "Customer login failed" });
    }

    res.json({
      message: "Customer login success",
      role: "customer",
      user: customer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// employee login
app.post("/employees/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await employeesCollection.findOne({ email, password });

    if (!employee) {
      return res.status(401).json({ message: "Employee login failed" });
    }

    res.json({
      message: "Employee login success",
      role: "employee",
      user: employee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CART / ORDER
========================= */

// Create order
app.post("/orders", async (req, res) => {
  try {
    const orderData = {
      customerId: req.body.customerId,
      orderDate: new Date(),
      status: req.body.status || "cart",
      totalAmount: Number(req.body.totalAmount) || 0,
      paymentStatus: req.body.paymentStatus || "unpaid",
    };

    const result = await ordersCollection.insertOne(orderData);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by customerId
app.get("/orders/customer/:customerId", async (req, res) => {
  try {
    const data = await ordersCollection.find({
      customerId: req.params.customerId,
    }).toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add order detail
app.post("/orderdetails", async (req, res) => {
  try {
    const detail = {
      orderId: req.body.orderId,
      productId: req.body.productId,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      amount: Number(req.body.quantity) * Number(req.body.price),
    };

    const result = await orderDetailsCollection.insertOne(detail);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order details by orderId
app.get("/orderdetails/:orderId", async (req, res) => {
  try {
    const data = await orderDetailsCollection.find({
      orderId: req.params.orderId,
    }).toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quantity in cart
app.put("/orderdetails/:id", async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    const price = Number(req.body.price);

    const result = await orderDetailsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          quantity: qty,
          price: price,
          amount: qty * price,
        },
      }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from cart
app.delete("/orderdetails/:id", async (req, res) => {
  try {
    const result = await orderDetailsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Checkout paid order
app.put("/orders/pay/:id", async (req, res) => {
  try {
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          status: "completed",
          paymentStatus: "paid",
        },
      }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   REVENUE STATISTICS
========================= */

// Revenue by month/year only paid orders
app.get("/revenue", async (req, res) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const data = await ordersCollection
      .aggregate([
        {
          $match: {
            paymentStatus: "paid",
            orderDate: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Cannot start server:", err.message);
  }
}

startServer();
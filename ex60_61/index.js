console.log("=== THIS SERVER FILE ===", __filename);

const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const crypto = require("crypto");
const https = require("https");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3002;

/* =========================
   MIDDLEWARE
========================= */
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  fileUpload({
    limits: { fileSize: 10000000 },
    abortOnLimit: true,
  })
);

app.use(express.static("public"));

/* =========================
   MONGODB
========================= */
const client = new MongoClient("mongodb://127.0.0.1:27017");

let database;
let paymentsCollection;
let fashionCollection;
let usersCollection;

async function runDB() {
  try {
    await client.connect();

    database = client.db("FashionData");
    paymentsCollection = database.collection("Payments");
    fashionCollection = database.collection("Fashion");
    usersCollection = database.collection("Users");

    await usersCollection.createIndex({ username: 1 }, { unique: true });

    console.log("Connected MongoDB FashionData");
    console.log("Connected collection: Payments");
    console.log("Connected collection: Fashion");
    console.log("Connected collection: Users");
  } catch (err) {
    console.error("DB CONNECT ERROR:", err.message);
  }
}

runDB();

function ensureCollectionReady(collection, res, name) {
  if (!collection) {
    res.status(503).json({
      success: false,
      message: `${name} is not ready yet`,
    });
    return false;
  }
  return true;
}

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    file: __filename,
  });
});

/* =========================
   IMAGE / UPLOAD
========================= */
app.get("/image/:id", (req, res) => {
  const id = req.params.id;
  res.sendFile(__dirname + "/upload/" + id);
});

app.post("/upload", (req, res) => {
  try {
    const { image } = req.files || {};

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No file",
      });
    }

    image.mv(__dirname + "/upload/" + image.name);

    return res.json({
      success: true,
      filename: image.name,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   FASHION API
========================= */
app.get(["/fashions", "/fashions/"], async (req, res) => {
  try {
    if (!ensureCollectionReady(fashionCollection, res, "Fashion collection")) return;

    const result = await fashionCollection.find({}).toArray();

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/fashions/:id", async (req, res) => {
  try {
    if (!ensureCollectionReady(fashionCollection, res, "Fashion collection")) return;

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ObjectId",
      });
    }

    const doc = await fashionCollection.findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    return res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   MOMO API
========================= */
app.post("/api/momo/create", async (req, res) => {
  try {
    if (!ensureCollectionReady(paymentsCollection, res, "Payments collection")) return;

    const amount = String(req.body.amount || "10000");

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "Thanh toán đơn hàng";
    const redirectUrl = "http://localhost:4200/momo-return";
    const ipnUrl = "https://webhook.site/test";
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    const signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      momoRes.setEncoding("utf8");

      let body = "";

      momoRes.on("data", (chunk) => {
        body += chunk;
      });

      momoRes.on("end", async () => {
        try {
          const result = JSON.parse(body);
          const payUrl = result.payUrl;

          await paymentsCollection.insertOne({
            orderId,
            requestId,
            amount: Number(amount),
            orderInfo,
            status: "PENDING",
            payUrl: payUrl || null,
            resultCode: result.resultCode ?? null,
            message: result.message ?? null,
            createdAt: new Date(),
          });

          return res.json({
            success: true,
            orderId,
            payUrl,
          });
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      });
    });

    momoReq.on("error", (e) => {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/momo/payments", async (req, res) => {
  try {
    if (!ensureCollectionReady(paymentsCollection, res, "Payments collection")) return;

    const data = await paymentsCollection.find({}).sort({ createdAt: -1 }).toArray();

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   REGISTER / LOGIN
========================= */
app.post("/register", async (req, res) => {
  try {
    if (!ensureCollectionReady(usersCollection, res, "Users collection")) return;

    console.log("REGISTER BODY:", req.body);

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username or password",
      });
    }

    const existed = await usersCollection.findOne({ username });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Username existed",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      username,
      password: hash,
      createdAt: new Date(),
    });

    console.log("REGISTER SUCCESS:", username);

    return res.json({
      success: true,
      message: "Register success",
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (!ensureCollectionReady(usersCollection, res, "Users collection")) return;

    console.log("LOGIN BODY:", req.body);

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username or password",
      });
    }

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    res.cookie("login_username", username, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      httpOnly: false,
    });

    res.cookie("login_password", password, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      httpOnly: false,
    });

    console.log("LOGIN SUCCESS:", username);

    return res.json({
      success: true,
      message: "Login success",
      username,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/read-login-cookie", (req, res) => {
  try {
    console.log("READ LOGIN COOKIE:", req.cookies);

    return res.json({
      success: true,
      username: req.cookies.login_username || "",
      password: req.cookies.login_password || "",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      username: "",
      password: "",
      message: err.message,
    });
  }
});

app.get("/clear-login-cookie", (req, res) => {
  res.clearCookie("login_username", {
    sameSite: "lax",
  });

  res.clearCookie("login_password", {
    sameSite: "lax",
  });

  console.log("LOGIN COOKIE CLEARED");

  return res.json({
    success: true,
    message: "Login cookie cleared",
  });
});

/* =========================
   EXERCISE 60 - COOKIE
========================= */
app.get("/create-cookie", (req, res) => {
  const account = {
    username: "tranduythanh",
    password: "123456",
  };

  res.cookie("ex60_username", "tranduythanh");
  res.cookie("ex60_password", "123456");
  res.cookie("ex60_account", account);

  res.cookie("ex60_infor_limit1", "I am limited Cookie - way 1", {
    expires: new Date(Date.now() + 360000),
  });

  res.cookie("ex60_infor_limit2", "I am limited Cookie - way 2", {
    maxAge: 360000,
  });

  return res.send("cookies are created");
});

app.get("/read-cookie", (req, res) => {
  const username = req.cookies.ex60_username;
  const password = req.cookies.ex60_password;
  const account = req.cookies.ex60_account;

  let infor = "";
  infor += "username = " + (username || "") + "<br/>";
  infor += "password = " + (password || "") + "<br/>";

  if (account != null) {
    infor += "account.username = " + account.username + "<br/>";
    infor += "account.password = " + account.password + "<br/>";
  }

  return res.send(infor);
});

app.get("/clear-cookie", (req, res) => {
  res.clearCookie("ex60_username");
  res.clearCookie("ex60_password");
  res.clearCookie("ex60_account");
  res.clearCookie("ex60_infor_limit1");
  res.clearCookie("ex60_infor_limit2");

  return res.send("[ex60] Cookies are removed");
});

/* =========================
   START SERVER
========================= */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
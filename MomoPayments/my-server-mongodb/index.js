const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3002;

const morgan = require("morgan");
app.use(morgan("combined"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

app.use(
  fileUpload({
    limits: { fileSize: 10000000 },
    abortOnLimit: true,
  })
);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

/* PHẦN UPLOAD IMAGE GIỮ NGUYÊN */
app.get("/image/:id", cors(), (req, res) => {
  const id = req.params["id"];
  res.sendFile(__dirname + "/upload/" + id);
});

app.post("/upload", (req, res) => {
  const { image } = req.files || {};
  if (!image) return res.sendStatus(400);
  image.mv(__dirname + "/upload/" + image.name);
  res.sendStatus(200);
});

/* PHẦN MONGODB + MOMO THÊM VÀO */
const crypto = require("crypto");
const https = require("https");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");

let database, paymentsCollection;

async function runDB() {
  await client.connect();
  database = client.db("FashionData");
  paymentsCollection = database.collection("Payments");
  console.log("Connected to MongoDB FashionData.Payments");
}
runDB().catch(console.dir);

/* 1 API tạo thanh toán MoMo */
app.post("/api/momo/create", async (req, res) => {
  try {
    const amountNum = Number(req.body.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: "Amount must be > 0" });
    }
    const amount = String(Math.floor(amountNum));

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "pay with MoMo";

    const redirectUrl = "http://localhost:4200/momo-return";
    const ipnUrl = "https://webhook.site/test";
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature =
      "accessKey=" + accessKey +
      "&amount=" + amount +
      "&extraData=" + extraData +
      "&ipnUrl=" + ipnUrl +
      "&orderId=" + orderId +
      "&orderInfo=" + orderInfo +
      "&partnerCode=" + partnerCode +
      "&redirectUrl=" + redirectUrl +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

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
      momoRes.on("data", (chunk) => (body += chunk));

      momoRes.on("end", async () => {
        let result;
        try {
          result = JSON.parse(body);
        } catch (e) {
          return res.status(500).json({ message: "MoMo response parse error", raw: body });
        }

        const payUrl = result?.payUrl || null;

        await paymentsCollection.insertOne({
          orderId,
          requestId,
          amount: Number(amount),
          orderInfo,
          status: "PENDING",
          payUrl,
          resultCode: result?.resultCode ?? null,
          message: result?.message ?? null,
          createdAt: new Date(),
        });

        return res.json({ orderId, payUrl, momo: result });
      });
    });

    momoReq.on("error", (e) => {
      return res.status(500).json({ message: e.message });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* 2 API lấy lịch sử Payments cho bảng Angular */
app.get("/api/momo/payments", async (req, res) => {
  const list = await paymentsCollection.find({}).sort({ createdAt: -1 }).toArray();
  res.json(list);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const cookieParser = require("cookie-parser");
const express = require("express");
const { dbConnect } = require("./src/config/db");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// app.use("/");

app.get("/", (req, res) => {
  res.json({ msg: "hi" });
});

dbConnect().then(() =>
  app.listen(PORT, () => {
    console.log(`Connected to server successfully at ${PORT}`);
  })
);

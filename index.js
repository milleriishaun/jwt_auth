const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenvsafe = require("dotenv-safe");

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

if (process.env.NODE_ENV !== "production") {
  dotenvsafe.config();
}

const normalizePort = port => parseInt(port, 10);
const port = normalizePort(process.env.PORT || "3000");

// Connect to DB
mongoose.connect(
  `mongodb+srv://tuser:${process.env.PW}@cluster0-rpbkd.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("hi from DB connect");
  }
);

// Middleware
app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`hello from port 1 ${port}`);
});

//mongodb+srv://tuser:<password>@cluster0-rpbkd.mongodb.net/test?retryWrites=true&w=majority

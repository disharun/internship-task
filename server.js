const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/form-builder",
  {
    // Remove deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,

    // Add proper TLS configuration for MongoDB Atlas
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,

    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 1,

    // Timeout settings
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,

    // Retry settings
    retryWrites: true,
    retryReads: true,

    // Write concern
    w: "majority",
  }
);

// Alternative connection method if the above fails
// Uncomment this if you continue to have TLS issues
/*
mongoose.connect(process.env.MONGODB_URI, {
  ssl: true,
  tls: true,
  tlsInsecure: false,
  directConnection: false,
  retryWrites: true,
  w: 'majority'
});
*/

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.use("/api/forms", require("./routes/forms"));
app.use("/api/responses", require("./routes/responses"));
app.use("/uploads", express.static("uploads"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

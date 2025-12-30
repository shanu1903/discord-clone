const express = require("express");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const app = express();
const mongoose = require("mongoose");
const validateToken = require("./middlewares/authMiddlewares");
const registerServer = require("./socketServer");

const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || process.env.API_PORT;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;

app.use(cors()); 
app.use(express.json()); // parse api requests in json format
app.use("/api/auth", authRoutes);

app.get("/test",validateToken ,  (req, res) => {
  res.send("Welcome to the Discord Clone API");
});

const server = http.createServer(app);
registerServer(server);


mongoose
  .connect(
    `mongodb+srv://${DB_USER}@${DB_NAME}.40jaoww.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

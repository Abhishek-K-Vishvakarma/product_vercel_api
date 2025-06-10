require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const router = require('../routes/router');
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI).then(()=> console.log("DB CONNECTED")).catch((error)=> console.log("DB ERROR", error));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', router);
if (process.env.NODE_ENV !== 'development'){
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}
module.exports = app;
module.exports.handler = serverless(app);



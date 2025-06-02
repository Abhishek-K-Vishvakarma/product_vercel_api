const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const authRouter = require("./router")
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/regiappdb", {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("Connected to MongoDB");
}).catch((error)=>{
  console.error("Database connection error:", error);
});


app.use("/api", authRouter);

app.listen(5000, ()=>{
  console.log("Server is running on port http://localhost:5000");
})


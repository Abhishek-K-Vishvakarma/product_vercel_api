// const express = require('express');
// const app = express();
// const cors = require('cors');
// const mongoose = require("mongoose");
// const authRouter = require("../routes/router")
// app.use(cors());
// app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/regiappdb", {
//   useNewURLParser: true,
//   useUnifiedTopology: true
// }).then(()=>{
//   console.log("Connected to MongoDB");
// }).catch((error)=>{
//   console.error("Database connection error:", error);
// });


// app.use("/api", authRouter);

// app.listen(5000, ()=>{
//   console.log("Server is running on port http://localhost:5000");
// })

// require('dotenv').config({ path: '../.env' }); // ✅ Important for nested /api folder
// const express = require('express');
// const mongoose = require('mongoose');
// const serverless = require('serverless-http');
// const router = require('../routes/router');

// const app = express();
// app.use(express.json());
// mongoose.connect(process.env.MONGO_URI,{
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("✅ MongoDB connected successfully.");
// }).catch(err => {
//   console.log("❌ MongoDB connection error: ", err);
// });

// app.use('/api', router);

// module.exports.handler = serverless(app);

// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running locally at http://localhost:${ PORT }`);
//   });
// }



require('dotenv').config({ path: '../.env' }); // load .env correctly from root
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const router = require('../routes/router'); // fix path if needed
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch(err => console.error("❌ MongoDB connection error:", err));

  
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api', router);

// Local server (only runs locally)
if (process.env.NODE_ENV !== 'production'){
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}

// ✅ Required by Vercel (must export a function)
module.exports = app;
module.exports.handler = serverless(app);



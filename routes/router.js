// const express = require("express");
// const router = express.Router();
// const {Register} = require("../logics/logics");

// router.post("/register", Register);

// module.exports = router;
// router.get("/test", (req, res) => {
//   res.send("Welcome to the API");
//   req.body = {message : "Welcome to the API"};
// });

const express = require("express");
const router = express.Router();
const { Register } = require("../logics/logics");

router.post("/register", Register);

router.get("/test", (req, res) => {
  res.send("Welcome to the API");
  req.body = { message: "Welcome to the API" };
});

module.exports = router;

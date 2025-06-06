const multer = require("multer");
const path = require("path");

const fs = require("fs");
const dir = path.join(__dirname, "uploads");

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

const uploaded = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "logo-" + Date.now() + path.extname(file.filename));
  }
})

const storeimage = multer({ uploaded });

module.exports = storeimage;
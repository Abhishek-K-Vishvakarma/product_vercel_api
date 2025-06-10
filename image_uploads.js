const multer = require("multer");
const path = require("path");
const dir_path = path.join(__dirname, "uploads");
const Image_Upload = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, dir_path)
  },
  filename: function (req, file, cb) {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage: Image_Upload});
module.exports = upload;
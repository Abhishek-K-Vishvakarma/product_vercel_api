
const nodeMail = require("nodemailer");


const sendMail = async(user, subjects, texts)=>{
  const transporter = nodeMail.createTransport({
    service: "gmail",
    auth: {
      user: "vishabhishek019@gmail.com",
      pass: "qzex yxke lxoz alsa",
      // pass: "djcj ozsn ybbt gwpu"
    }
  });


  await transporter.sendMail({
    from : "vishabhishek019@gmail.com",
    to : user,
    subject : subjects,
    text: texts
  })
}


module.exports = sendMail;
// const User = require("../models/models");

// const Register = async(req, res)=>{
//    try{
//     const {name, email, password} = req.body;
//     const user = await User.findOne({email})
//     if(user) return res.status(404).json({message: "User already exist!"});
//     const newUser = new User({name, email, password});
//     const saveuser = await newUser.save();
//     res.status(201).json({message : "User registered successfully!", user : saveuser});
//    }catch(error){
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//    }
// }

// module.exports = { Register };


const User = require("../models/models");

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(404).json({ message: "User already exists!" });
    const newUser = new User({ name, email, password });
    const saveuser = await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user: saveuser });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}



const Getuser = async()=>{
  try{
   const id = req.params.id;
   console.log("id is :", id);
  }catch(error){
    res.status(500).json({
      message : "Server Error :",
      error : error.message
    })
  }
}

module.exports = { Register, Getuser };

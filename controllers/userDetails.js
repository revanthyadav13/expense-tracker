const UserDetails = require('../models/userDetails');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');


exports.postRequestSignup =async (req, res, next)=>{

    try{
     const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

     const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(name, email, password);
    const data= await UserDetails.create({name:name, email:email, password:hashedPassword});

    res.status(201).json({newUserDetail:data});
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(403).json({ error: err });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
   
}

function generateAccessToken(id, name, ispremiumuser){
  return jwt.sign({userId:id, name :name, ispremiumuser:ispremiumuser}, process.env.SECRET_TOKEN)
}
exports.postRequestLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserDetails.findOne({ where: { email: email } });

    if (!user) {
      res.status(404).json({ error: 'Error: Request failed with status code 404 (or) account not found.' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.status(200).json({ message: 'user logged in successfully',token:generateAccessToken(user.id, user.name, user.ispremiumuser)});
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



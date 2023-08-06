const UserDetails = require('../models/userDetails');


exports.postRequestSignup =async (req, res, next)=>{

    try{
     const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    console.log(name, email, password);
    const data= await UserDetails.create({name:name, email:email, password:password});

    res.status(201).json({newUserDetail:data});
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(403).json({ error: err });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
   
}


exports.postRequestLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userEmail = await UserDetails.findOne({ where: { email:email } });
    const userPassword = await UserDetails.findOne({ where: { password:password } });

    if (!userEmail) {
      res.status(404).json({ error: 'Error:Request failed with status code 404 (or) account not found.' });
     }
      else if (!userPassword) {
      res.status(401).json({ error: 'Incorrect password' });
    }
     else {
      res.status(200).json({ message: 'Login successful' });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



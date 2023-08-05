const UserDetails = require('../models/userDetails');


exports.postRequest =async (req, res, next)=>{

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






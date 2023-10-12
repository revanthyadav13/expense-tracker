const User = require('../models/user'); // Assuming you have a Mongoose model named 'User'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postRequestSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(name, email, password);

    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ newUserDetail: newUser });
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key error
      res.status(403).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

function generateAccessToken(id, name, ispremiumuser) {
  return jwt.sign({ userId: id, name: name, ispremiumuser: ispremiumuser }, process.env.SECRET_TOKEN);
}

exports.postRequestLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ error: 'Account not found.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = generateAccessToken(user._id, user.name, user.ispremiumuser);
      res.status(200).json({ message: 'User logged in successfully', token });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

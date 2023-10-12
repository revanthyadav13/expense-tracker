const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: "Token not provided", success: false });
        }

        const user = await jwt.verify(token, process.env.SECRET_TOKEN);
        const foundUser = await User.findById(user.userId);

        if (!foundUser) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        req.user = foundUser;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, success: false });
    }
};

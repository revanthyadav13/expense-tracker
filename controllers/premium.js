const User = require('../models/user');

exports.getRequestLeaderBoard = async (req, res, next) => {
  try {
    const userLeaderBoardDetails = await User.find()
      .select('id name totalExpenses')
      .sort({ totalExpenses: -1 });

    res.status(200).json({ userLeaderBoardDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

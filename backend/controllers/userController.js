const User = require("../models/userModel");

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const users = await User.findUserById(id);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const id = req.user.id; // comes from the verified token, not the URL

    const users = await User.findUserById(id);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      message: 'All fields are required',
      status: 0,
    });
  }

  const isExist = await user.findOne({ email });
  if (isExist) {
    return res.send({
      message: 'user Already exist',
      status: 2,
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new user({ name, email, password: encryptedPassword });
    await newUser.save();
    res.send({
      message: 'user Created Successfully',
      status: 1,
    });
  } catch (error) {
    res.status(400).send({
      message: 'Errors in registration',
      status: 0,
    });
    console.log('error in user registrtion', error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: 'All fields are required',
      status: 0,
    });
  }

  const isUserExist = await user.findOne({ email });
  if (!isUserExist) {
    return res.status(500).send({
      message: 'user doesnot  exist',
      status: 500,
    });
  }
  try {
    const decryptPassword = await bcrypt.compare(
      password,
      isUserExist.password,
    );

    if (!decryptPassword) {
      return res.status(500).send({
        message: 'password error',
        status: 400,
      });
    } else {
      const token = jwt.sign(
        { userId: isUserExist._id },
        process.env.SECRET_KEY,
      );
      return res.send({
        status: 200,
        message: 'successfully loged-in',
        token,
        userId: isUserExist._id,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: 'errors in login',
      status: 300,
    });
    console.log('Error login:', error);
  }
};

module.exports = { registerUser, loginUser };

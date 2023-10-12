const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

exports.postForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const id = uuid.v4();
      await ForgotPasswordRequest.create({ id, userId: user._id, isactive: true });

      const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

      const sender = {
        email: 'support@gmail.com',
        name: 'Support Team',
      };

      const receivers = [
        {
          email,
          name: 'receiver',
        },
      ];

      const subject = 'Reset Password';
      const htmlContent = `
        <p>Hello,</p>
        <p>Click the following link to reset your password:</p>
        <a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `;

      const sendEmail = await transactionalEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject,
        htmlContent,
      });

      res.status(200).json({ sendEmail });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.getResetPassword = async (req, res, next) => {
  const id = req.params.id;

  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ id });

    if (forgotPasswordRequest) {
      await forgotPasswordRequest.updateOne({ isactive: false });

      res.status(200).send(`
        <html>
          <script>
            function formsubmitted(e) {
              e.preventDefault();
              console.log('called');
            }
          </script>
          <form action="http://localhost:3000/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
          </form>
        </html>
      `);
    } else {
      res.status(404).json('Forgot password request not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const resetPasswordRequest = await ForgotPasswordRequest.findOne({ id: resetpasswordid });

    if (resetPasswordRequest) {
      const user = await User.findById(resetPasswordRequest.userId);

      if (user) {
        const saltRounds = 10;

        try {
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(newpassword, salt);

          await User.updateOne( { _id: user._id },{ password: hash } );

          res.status(201).json({ message: 'Successfully updated the new password' });
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      } else {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
    } else {
      return res.status(404).json({ error: 'Invalid reset password request', success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

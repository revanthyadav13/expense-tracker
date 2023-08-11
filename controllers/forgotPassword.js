const UserDetails = require('../models/userDetails');
const ForgotPasswordRequest = require('../models/forgotpasswordRequest');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


require('dotenv').config();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY; // Replace with your SendinBlue API key

exports.postForgotPassword=async (req, res, next) => {
  try {
    const { email } = req.body;
   const user = await UserDetails.findOne({ where: { email: email} });

     if(user){
            const id = uuid.v4();
          await  ForgotPasswordRequest.create({ id:id , isactive: true })
                .catch(err => {
                    throw new Error(err)
                }) 
     
    const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
  email: "support@gmail.com",
  name: 'Support Team'
};

const receivers =[{
  email: email,
  name: "receiver"
}] ;

const subject = 'reset password';
const htmlContent =  `
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
    res.status(200).json({sendEmail});
     }else{
        return res.status(404).json({ error: "User not found" });
     }
}catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

}


exports.getResetPassword=async(req, res, next)=>{
const id = req.params.id;

  try {
    const forgotpasswordrequest = await ForgotPasswordRequest.findOne({ where: { id } });

    if (forgotpasswordrequest) {
      await forgotpasswordrequest.update({ isactive: false });

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
      res.status(404).send('Forgot password request not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}

exports.getUpdatePassword=async (req, res, next)=>{
       try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
console.log("resetpasswordid>>>>>",resetpasswordid)
    const resetpasswordrequest = await ForgotPasswordRequest.findOne({
      where: { id: resetpasswordid }
    });

    if (!resetpasswordrequest) {
      return res.status(404).json({ error: 'Forgot password request not found', success: false });
    }

    const user = await UserDetails.findOne({ where: { id: resetpasswordrequest.userId } });

    if (!user) {
      return res.status(404).json({ error: 'No user exists', success: false });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newpassword, salt);

    try {
      await user.update({ password: hash });
      res.status(201).json({ message: 'Successfully updated the new password', success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error, success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error, success: false });
  }

}
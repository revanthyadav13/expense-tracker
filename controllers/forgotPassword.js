const UserDetails = require('../models/userDetails');
const SibApiV3Sdk = require('sib-api-v3-sdk');


require('dotenv').config();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY; // Replace with your SendinBlue API key

exports.postForgotPassword=async (req, res, next) => {
  try {
    const { email } = req.body;
   const user = await UserDetails.findOne({ where: { email: email} });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } 

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
const htmlContent = '<p>Hello, this is a test transactional email!</p>';

    const sendEmail = await transactionalEmailApi.sendTransacEmail({
   sender, 
  to: receivers,
  subject,
  htmlContent,
  });
    res.status(200).json({sendEmail});
}catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

}

require('dotenv').config();

const Razorpay = require('razorpay');
const Order = require('../models/orders');

exports.getRequestPurchasePremium =async (req, res, next)=>{

     try {
    const razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    });
    
    const amount = 2500;
    const currency = 'INR';

    const options = {
      amount,
      currency,
    };
    const order = await new Promise((resolve, reject) => {
      razorpay.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

    res.status(201).json({ order, key_id: process.env.KEY_ID });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }

}


exports.updateTransactionStatus =async (req, res, next)=>{
   const { payment_id, order_id } = req.body;
          
  try {
 const orderPromise = Order.findOne({ where: { orderid: order_id } });
    const userPromise = req.user;

    const [order, user] = await Promise.all([orderPromise, userPromise]);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (payment_id) {
      await Promise.all([
        order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }),
        user.update({ ispremiumuser: true })
      ]);

      return res.status(202).json({ message: 'Transaction successful' });
    } else {
      await Promise.all([
        order.update({ status: 'FAILED' }),
        user.update({ ispremiumuser: false })
      ]);

      return res.status(400).json({ message: 'Transaction failed' });
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

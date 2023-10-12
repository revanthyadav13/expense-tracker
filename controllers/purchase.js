require('dotenv').config();

const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user'); 

exports.getRequestPurchasePremium = async (req, res, next) => {
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

    const newOrder = new Order({ userId: req.user._id, orderid: order.id, status: 'PENDING' });
await newOrder.save();


    res.status(201).json({ order, key_id: process.env.KEY_ID });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  const { payment_id, order_id } = req.body;

  try {
    const order = await Order.findOne({ orderid: order_id });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (payment_id) {
      await Promise.all([
        Order.updateOne({ orderid: order_id }, { paymentid: payment_id, status: 'SUCCESSFUL' }),
        req.user.updateOne({ ispremiumuser: true })
      ]);

      return res.status(202).json({ message: 'Transaction successful' });
    } else {
      await Promise.all([
        Order.updateOne({ orderid: order_id }, { status: 'FAILED' }),
        req.user.updateOne({ ispremiumuser: false })
      ]);

      return res.status(400).json({ message: 'Transaction failed' });
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

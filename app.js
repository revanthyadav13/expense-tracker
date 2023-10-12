const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');


const User=require('./models/user');
const expense=require('./models/expense');
const Order=require('./models/orders');
const ForgotPasswordRequest=require('./models/forgotPasswordRequest');
const ContentUploaded=require('./models/contentUploaded');


const app = express();
app.use(cors());
dotenv.config();


const userRoutes=require('./routes/user')
const expenseRoutes=require('./routes/expense')
const purchaseRoutes=require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const forgotPasswordRoutes=require('./routes/forgotPassword')

const accessLogStream=fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags:'a'}
  );

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgotPasswordRoutes);


mongoose.connect("mongodb+srv://revanth:fEChn28xpRPQZf5m@cluster0.ybysmcy.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=AtlasApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB')
  )
  .catch((err) => console.error('MongoDB connection error:', err));
  
  try {
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
} catch (error) {
  console.error(`Error starting the server: 3000`);
}
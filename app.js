const path = require('path');
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');


const UserDetails=require('./models/userDetails');
const ExpenseDetails=require('./models/expenseDetails');
const Order=require('./models/orders');
const ForgotPasswordRequest=require('./models/forgotPasswordRequest');
const ContentUploaded=require('./models/contentUploaded');


const app = express();
app.use(cors());
dotenv.config();


const userDetailsRoutes=require('./routes/userDetails')
const expenseDetailsRoutes=require('./routes/expenseDetails')
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

app.use('/user',userDetailsRoutes);
app.use('/expense',expenseDetailsRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgotPasswordRoutes);

UserDetails.hasMany(ExpenseDetails,{ foreignKey: 'userId' });
ExpenseDetails.belongsTo(UserDetails,{ foreignKey: 'userId' });

UserDetails.hasMany(Order,{ foreignKey: 'userId' });
Order.belongsTo(UserDetails,{ foreignKey: 'userId' });

UserDetails.hasMany(ForgotPasswordRequest, {foreignKey: 'userId'});
ForgotPasswordRequest.belongsTo(UserDetails, {foreignKey: 'userId'});

UserDetails.hasMany(ContentUploaded, {foreignKey: 'userId'});
ContentUploaded.belongsTo(UserDetails, {foreignKey: 'userId'});


sequelize
//.sync({ alter: true })
.sync()
  .then(result => {
   app.listen(process.env.PORT || 3000);
  })

const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');


const UserDetails=require('./models/userDetails');
const ExpenseDetails=require('./models/expenseDetails');
const Order=require('./models/orders');
const ForgotPasswordRequest=require('./models/forgotPasswordRequest');


const app = express();
app.use(cors());

const dotenv = require('dotenv');



const userDetailsRoutes=require('./routes/userDetails')
const expenseDetailsRoutes=require('./routes/expenseDetails')
const purchaseRoutes=require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const forgotPasswordRoutes=require('./routes/forgotPassword')


app.use(express.json());

app.use('/user',userDetailsRoutes);
app.use('/expense',expenseDetailsRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',forgotPasswordRoutes);

UserDetails.hasMany(ExpenseDetails,{ foreignKey: 'userId' });
ExpenseDetails.belongsTo(UserDetails,{ foreignKey: 'userId' });

UserDetails.hasMany(Order,{ foreignKey: 'userId' });
Order.belongsTo(UserDetails,{ foreignKey: 'userId' });

UserDetails.hasMany(ForgotPasswordRequest, { foreignKey: 'userId' });
ForgotPasswordRequest.belongsTo(UserDetails, { foreignKey: 'userId' });

sequelize
//.sync({ force: true })
 .sync()
  .then(result => {
   app.listen(3000);
  })
const path = require('path');

const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');


const UserDetails=require('./models/userDetails');
const ExpenseDetails=require('./models/expenseDetails');


const app = express();
app.use(cors());



const userDetailsRoutes=require('./routes/userDetails')
const expenseDetailsRoutes=require('./routes/expenseDetails')


app.use(express.json());

app.use('/user',userDetailsRoutes);
app.use('/expense',expenseDetailsRoutes);


sequelize
   //.sync({ force: true })
 .sync()
  .then(result => {
   app.listen(3000);
  })
const path = require('path');

const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const sequelize = require('./util/database');


const UserDetails=require('./models/userDetails');


const app = express();
app.use(cors());



const userDetailsRoutes=require('./routes/userDetails')


app.use(express.json());

app.use('/user',userDetailsRoutes);


sequelize
   //.sync({ force: true })
 .sync()
  .then(result => {
   app.listen(3000);
  })
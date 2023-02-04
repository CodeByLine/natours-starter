const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
// const app = require('./app');

dotenv.config({path: 'config.env'});

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


//// local database connection
mongoose
  .connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log("DB Connections Successful")); 

//console.log(app.get('env'));      //env variables are usual global
// console.log(process.env); 

// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}... `);
//   console.log(`App running on port 8000...`);
// });

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));


//import data
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);

        console.log("Data Imported Successfully");
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data deleted");
    } catch (err) {
        console.log(err);
    }
}

// console.log(process.argv);      // show the argv[] option
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

//// > node dev-data/data/import-dev-data.js
//// > node dev-data/data/import-dev-data.js --import

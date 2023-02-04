const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: 'config.env'});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION ... REJECTED 💥 Shutting down');
    console.log(err.name, err.message);
    // console.log(err);  // the entire error
    // server.close(() => {       // This gives the server a chance to save the state before closing' best practice
    process.exit(1); // 1: Shutting down; immediately abort
  });
  // });

const app = require('./app');
const Tour = require('./models/tourModel');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//// remote database connection
// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false 
// }).then(() => console.log("DB Connections Successful"));

  // alt display connection details for testing
  // }).then(con => {
  //   console.log(con.connections);
  //   console.log("DB Connections Successful");
  // });


//// local database connection
mongoose
  .connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log("DB Connections Successful")); 

//console.log(app.get('env'));      //env variables are usual global
// console.log(process.env); 

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});    // saving environment before shutting down

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}... `);
//   // console.log(`App running on port 8000...`);
// });

// Not the best way to handle these types of errors
// Both these two error handlers should be placed on the very top.
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTED REJECTED REJECTED 💥 Shutting down');
  // console.log(err.name, err.message);
  console.log(err);  // the entire error
  server.close(() => {       // This gives the server a chance to save the state before closing' best practice
    process.exit(1); // 1: Shutting down; immediately abort
  }) 
  });

  // process.on('uncaughtException', err => {
  //   console.log('UNCAUGHT EXCEPTION ... REJECTED 💥 Shutting down');
  //   console.log(err.name, err.message);
  //   console.log(err);  // the entire error
  //   server.close(() => {       // This gives the server a chance to save the state before closing' best practice
  //   process.exit(1); // 1: Shutting down; immediately abort
  // });
  // });

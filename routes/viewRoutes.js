const express = require('express');
const viewsController = require('../controllers/viewsController');
// const tourController = require('../controllers/tourController');
// const authController = require('../controllers/authController');
// // const fs = require('fs');
const router = express.Router();


// router.get('/', (req, res) => {
//     // res.status(200).render('base');
//     res.status(200).render('base', {
//       tour: 'The Forest Hiker',
//       user: 'Jonas'
//     });
//   })
  // app.get('/api/v1/tours', (req, res) => {
  //   res.status(200).render('base');
  // }
  // )
  
  router.get('/', viewsController.getOverview);
  
  router.get('/tour/:slug', viewsController.getTour);
  
  module.exports = router;
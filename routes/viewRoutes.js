const express = require('express');
const viewsController = require('../controllers/viewsController');
// const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// // const fs = require('fs');
const router = express.Router();

// router.use(authController.isLoggedIn);


// Remember to disable cache in developer tools in Chrome
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);

router.get('/login/', viewsController.getLoginForm);
  
module.exports = router;
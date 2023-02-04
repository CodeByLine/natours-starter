const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();


// router.param('id', userController.checkID);

// Handlers
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// authentication is needed for everything below
router.use(authController.protect); //will protect everything below and replace the protect lines
router.patch(
  '/updateMyPassword', 
  // authController.protect, 
  authController.updatePassword 
  );

router.get('/me', 
  // authController.protect, 
  userController.getMe, 
  userController.getUser); 
router.patch('/updateMe', 
  // authController.protect, 
  userController.updateMe); 
router.delete('/deleteMe', 
  // authController.protect, 
  userController.deleteMe); 

// protect everything below
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);



module.exports = router;
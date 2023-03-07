const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'});
    // 1. get the data
    // 2. build template
    // 3. render template using data from Step 1
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

 // Remember to disable cache in developer tools in Chrome ???

exports.getLoginForm = (req, res) => {

    res.status(200).render('login', {
        title: 'Log into your account', 
    });

}
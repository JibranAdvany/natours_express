const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(tourControllers.getToursWithin);

router
  .route('/distances/:latlang/unit/:unit')
  .get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.uploadTourImages,
    tourControllers.resizeTourImages,
    tourControllers.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;

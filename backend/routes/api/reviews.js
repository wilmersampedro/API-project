const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')
const router = express.Router();

const validateReview = [
  check('review')
    .notEmpty()
    .withMessage("Review text is required"),
  check('stars')
    .isInt({min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];


//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { id } = req.user;
  const { reviewId } = req.params;
  const { url } = req.body;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  }

  if (review.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  const images = await ReviewImage.findAll({
    where: {
      reviewId
    }
  })

  if (images.length >= 10) {
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached"
    })
  }

  const addedImage = await review.createReviewImage({url})
  res.json({
    id: addedImage.id,
    url: addedImage.url
  })

})

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { id } = req.user;
  const arr = [];
  const reviews = await Review.findAll({
    where: {
      userId: id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt']
        }
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })


  for (let i = 0; i < reviews.length; i++) {
    let review = reviews[i];

    const img = await SpotImage.findOne({
      where: {
        spotId: review.spotId
      }
    })
    review = review.toJSON();

    if(img) {
      review.Spot.previewImage = img.url
    } else {
      review.Spot.previewImage = "no preview Image"
    }
    arr.push(review)
  }
  res.json({Reviews: arr});
})


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { id } = req.user;

  const review = await Review.findByPk(reviewId);

  if(!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  }

  if (review.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

})









module.exports = router;

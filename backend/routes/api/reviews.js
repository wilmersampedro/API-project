const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { validateReview } = require('../../utils/validation')
const router = express.Router();


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
  const { review, stars } = req.body;

  const reviewToEdit = await Review.findByPk(reviewId);

  if(!reviewToEdit) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  }

  if (reviewToEdit.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  reviewToEdit.review = review;
  reviewToEdit.stars = stars;
  await reviewToEdit.save();

  res.json(reviewToEdit)

})


//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { id } = req.user;

  const reviewToDestroy = await Review.findByPk(reviewId);

  if(!reviewToDestroy) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  }

  if(reviewToDestroy.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  await reviewToDestroy.destroy();
  return res.json({
    message: "Successfully deleted"
  })
})





module.exports = router;

const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { id } = req.user;
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
    let spot = review.Spot;
    console.log(typeof spot)
    // spot = spot.toJSON();
    spot.previewImage = img
    // review.Spot.previewImage = img;
  }
  res.json({Reviews: reviews});
})












module.exports = router;

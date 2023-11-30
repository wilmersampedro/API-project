const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { id } = req.user;

  const reviewImg = await ReviewImage.findByPk(imageId, {
    include: Review
  })

  if(!reviewImg) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found"
    })
  }

  if(reviewImg.Review.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  await reviewImg.destroy();

  return res.json({
    message: "Successfully deleted"
  });
})

module.exports = router;

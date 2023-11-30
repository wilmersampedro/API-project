const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { id } = req.user;

  const spotImg = await SpotImage.findByPk(imageId, {
    include: Spot
  });

  if(!spotImg) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found"
    })
  }
  if(spotImg.Spot.ownerId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  await spotImg.destroy();

  return res.json({
    message: "Successfully deleted"
  })
})

module.exports = router;

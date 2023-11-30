const express = require('express');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
  const { id } = req.user;
  const resArr = [];

  const bookings = await Booking.findAll({
    where: {
      userId: id
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt']
        }
      }
    ]
  })

  for (let i = 0; i < bookings.length; i++){
    let booking = bookings[i];

    const previewImage = await SpotImage.findOne({
      where: {
        spotId: booking.spotId
      }
    })

    booking = booking.toJSON();
    if (previewImage) {
      booking.Spot.previewImage = previewImage.url;
    } else {
      booking.Spot.previewImage = "no preview image available"
    }

    resArr.push(booking)
  }

  return res.json({Bookings: resArr})

})

module.exports = router;

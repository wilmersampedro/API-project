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

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { id } = req.user;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);

  if(!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }

  if(booking.userId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  let measuredStartDate = Date.parse(startDate);
  let measuredEndDate = Date.parse(endDate);

  if (measuredEndDate <= measuredStartDate) {
    res.status(400);
    return res.json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    })
  }

  const currDate = Date.now()

  if (currDate > Date.parse(booking.endDate)) {
    res.status(403);
    return res.json({
      message: "Past bookings can't be modified"
    })
  }

  const currBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId
    }
  })

  for (let i = 0; i < currBookings.length; i++) {
    let currBooking = currBookings[i];
    existingStartDate = Date.parse(currBooking.startDate);
    existingEndDate = Date.parse(currBooking.endDate);

    if(currBooking.id !== booking.id) {

      if(measuredStartDate <= existingEndDate && measuredStartDate >= existingStartDate && measuredEndDate >= existingStartDate && measuredEndDate <= existingEndDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
          }
        })
      }

      if(measuredStartDate <= existingEndDate && measuredStartDate >= existingStartDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking"
          }
        })
      }

      if (measuredEndDate >= existingStartDate && measuredEndDate <= existingEndDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking"
          }
        })
      }

      if(measuredStartDate <= existingStartDate && measuredEndDate >= existingEndDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specific dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
          }
        })
      }
    }
  }

  booking.startDate = startDate;
  booking.endDate = endDate;

  await booking.save()

  return res.json(booking)
})

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { id } = req.user;

  const booking = await Booking.findByPk(bookingId, {
    include: Spot
  });

  if(!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }


  if(booking.userId === id || booking.Spot.ownerId === id) {
    if(Date.parse(booking.startDate) < Date.now()) {
      res.status(403);
      return res.json({
        message: "Bookings that have been started can't be deleted"
      })
    }

    await booking.destroy();

    return res.json({
      message: "Successfully deleted"
    })

  } else {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }
})


module.exports = router;

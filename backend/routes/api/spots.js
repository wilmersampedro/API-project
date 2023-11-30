const express = require('express');
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview } = require('../../utils/validation')
const { Op } = require('sequelize');
const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check('lat')
    .isFloat({min: -90, max: 90})
    // .notEmpty()
    .withMessage("Latitude is not valid"),
  check('lng')
    .isFloat({min: -180, max: 180})
    // .notEmpty()
    .withMessage("Longitude is not valid"),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check('price')
    .isFloat({min: 1})
    // .notEmpty()
    .withMessage("Price per day is required"),
  handleValidationErrors
];

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { id } = req.user;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if (spot.ownerId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  const spotImg = await SpotImage.create({
    spotId,
    url,
    preview
  })

  res.json({
    id: spotImg.id,
    url,
    preview
  })
})

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { id } = req.user;
  let { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if(spot.ownerId === id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

let measuredStartDate = Date.parse(startDate);
let measuredEndDate = Date.parse(endDate);

if (measuredStartDate >= measuredEndDate) {
  res.status(400);
  return res.json({
    message: "Bad Request",
    errors: {
      endDate: "endDate cannot be on or before startDate"
    }
  })
}

const currBookings = await Booking.findAll({
  where: {
    spotId
  }
})

for (let i = 0; i < currBookings.length; i++) {
  let currBooking = currBookings[i];
  existingStartDate = Date.parse(currBooking.startDate)
  existingEndDate = Date.parse(currBooking.endDate)

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


  const newBooking = await spot.createBooking({
    spotId,
    userId: id,
    startDate,
    endDate
  })

  return res.json(newBooking)

})


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { id } = req.user;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }


  if (spot.ownerId !== id) { //NOT the owner
    const bookings = await Booking.findAll({
      where: {
        spotId
      },
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt']
      }
    })
  return res.json({Bookings: bookings})
  } else {
    const bookings = await Booking.findAll({ //ARE the owner
      where: {
        spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    })
    return res.json({Bookings: bookings})
  }
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const reviews = await Review.findAll({
    where: {
      spotId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })

  res.json({Reviews: reviews})
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const potenshReview = await Review.findOne({
    where: {
      [Op.and]: [
        {userId: req.user.id},
        {spotId: spotId}
      ]
    }
  })

  if(potenshReview) {
    res.status(500);
    return res.json({
      message: "User already has a review for this spot"
    })
  }

  const newReview = await spot.createReview({
    userId: req.user.id,
    spotId: spot.id,
    review,
    stars
  })

  res.status(201);
  return res.json(newReview)
})

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  const { id } = req.user
  const resArr = [];

  const spots = await Spot.findAll({
    where: {
      ownerId: id
    }
  })

for (let i = 0; i < spots.length; i++) {
  let spot = spots[i];

  const reviewCount = await Review.count({
    where: {
      spotId: spot.id
    }
  })

  const reviewSum = await Review.sum('stars', {
    where: {
      spotId: spot.id
    }
  })

  const avgRating = reviewSum / reviewCount;

  const previewImage = await SpotImage.findOne({
    where: {
      spotId: spot.id
    }
  })

  spot = spot.toJSON();
  spot.avgRating = avgRating;
  spot.previewImage = previewImage.url;
  resArr.push(spot);
}




  res.json({Spots: resArr})
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const { spotId } = req.params;
  const { id } = req.user;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if (spot.ownerId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save()
  res.json(spot)
})

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;
  let spot = await Spot.findByPk(spotId, {
    include: {
      model: SpotImage,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'spotId']
      }
    }
  });


  if(!spot) {
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const numReviews = await Review.count({
    where: {
      spotId
    }
  })

  const sumReviews = await Review.sum('stars', {
    where: {
      spotId
    }
  })

  const avgRating = sumReviews / numReviews;

  spot = spot.toJSON();
  spot.numReviews = numReviews;
  spot.avgRating = avgRating;
  spot.Owner = await User.findByPk(spot.ownerId, {
    attributes: {
      exclude: ['username']
    }
  })
  res.json(spot)
})

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { id } = req.user;

  const spotToDestroy = await Spot.findByPk(spotId);

  if (!spotToDestroy) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  if (spotToDestroy.ownerId !== id) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    })
  }


  await spotToDestroy.destroy();
  return res.json({
    message: "Successfully deleted"
  })

})


//create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { id } = req.user;
  const spot = await Spot.create({ownerId: id, address, city, state, country, lat, lng, name, description, price})

  res.status(201);
  res.json(spot);
})


//get all spots
router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll()
  const resArr = [];

  for(let i = 0; i < spots.length; i++) {
    let spot = spots[i];
    const reviewCount = await Review.count({
      where: {
        spotId: spot.id
      }
    })
    const reviewSum = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })

    const avgRating = reviewSum / reviewCount
    //preview images
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id
      }
    })

    spot = spot.toJSON();
    if (avgRating) {
      spot.avgRating = avgRating;
    } else {
      spot.avgRating = "no ratings yet"
    }
    if (previewImage) {
      spot.previewImage = previewImage.url
    } else {
      spot.previewImage = "no preview image"
    }
    resArr.push(spot);
  }



  res.json({Spots: resArr});
})


module.exports = router;

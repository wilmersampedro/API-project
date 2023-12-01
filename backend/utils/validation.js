const { validationResult } = require('express-validator');
const { check, param } = require('express-validator');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateReview = [
  check('review')
    .notEmpty()
    .withMessage("Review text is required"),
  check('stars')
    .isInt({min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

//only check
const validateQueryParams = (query) => {
  let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = query;
  const errors = {}

  page = parseInt(page);
  size = parseInt(size);

  if (page < 1) {
    errors.page = "Page must be greater than or equal to 1"
  }

  if (size < 1) {
    errors.size = "Size must be greater than or equal to 1"
  }

  if(maxLat) {
    if (maxLat < -90 || maxLat > 90) {
      errors.maxLat = "Maximum latitude is invalid"
    }
  }

  if(minLat) {
    if (minLat < - 90 || minLat > 90) {
      errors.minLat = "Minimum latitude is invalid"
    }
  }

  if(maxLng) {
    if (maxLng < -180 || maxLng > 180) {
      errors.maxLng = "Maximum longitude is invalid"
    }
  }

  if(minLng) {
    if (minLng < -180 || minLng > 180) {
      errors.minLng = "Minimum longitude is invalid"
    }
  }

  if(minPrice) {
    if (minPrice < 0) {
      errors.minPrice = "Minimum price must be greater than or equal to 0"
    }

  }

  if (maxPrice) {
    if (maxPrice < 0) {
      errors.maxPrice = "Maximum price must be greater than or equal to 0"
    }

  }

  return errors;
}
// const validateQueryParams = [
//   // param('page')
//   //   .isInt({min: 1, max: 10})
//   //   .default(1)
//   //   .withMessage("Page must be greater than or equal to 1"),
//   // param('size')
//   //   .isInt({min: 1, max: 20})
//   //   .default(20)
//   //   .withMessage("Size must be greater than or equal to 1"),
//   param('maxLat')
//     .optional({values: undefined})
//     .isFloat({min: -90, max: 90})
//     .withMessage("Maximum latitude is invalid"),
//   param('minLat')
//     .optional()
//     .isDecimal()
//     .withMessage("Minimum latitude is invalid"),
//   param('minLng')
//     .optional()
//     .isDecimal()
//     .withMessage("Minimum longitude is invalid"),
//   param('maxLng')
//     .optional()
//     .isDecimal()
//     .withMessage("Maximum longitude is invalid"),
//   param('minPrice')
//     .optional()
//     .isDecimal()
//     .custom(value => {
//       if (this.minPrice < 0) {
//         throw new Error("Minimum price must be greater than or equal to 0")
//       }
//     }),
//   param('maxPrice')
//     .optional()
//     .isDecimal()
//     .custom(value => {
//       if (value < 0) {
//         throw new Error("Maximum price must be greater than or equal to 0")
//       }
//     }),
//   handleValidationErrors
// ]

module.exports = {
  handleValidationErrors,
  validateReview,
  validateQueryParams
};

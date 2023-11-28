'use strict';
const { Review } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 2,
        userId: 3,
        review: 'pleasant stay',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Amazing place to be!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Love going here when I can',
        stars: 5
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

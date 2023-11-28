'use strict';
const { Booking } = require('../models');

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 7,
        userId: 1,
        startDate: 2023-11-19,
        endDate: 2023-11-21
      },
      {
        spotId: 8,
        userId: 2,
        startDate: 2023-11-25,
        endDate: 2023-11-27
      },
      {
        spotId: 9,
        userId: 3,
        startDate: 2021-12-8,
        endDate: 2021-12-10
      },
      {
        spotId: 10,
        userId: 4,
        startDate: 2021-12-19,
        endDate: 2021-12-20
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

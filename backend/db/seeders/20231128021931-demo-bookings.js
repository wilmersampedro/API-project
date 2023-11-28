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
        spotId: 3,
        userId: 1,
        startDate: 2021-11-19,
        endDate: 2021-11-21
      },
      {
        spotId: 1,
        userId: 2,
        startDate: 2021-11-25,
        endDate: 2021-11-27
      },
      {
        spotId: 2,
        userId: 3,
        startDate: 2021-12-8,
        endDate: 2021-12-10
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

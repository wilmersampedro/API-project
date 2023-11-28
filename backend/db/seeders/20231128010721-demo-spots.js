'use strict';

const { Spot } = require('../models')
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "321 Disney Lane",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 46.7645358,
        lng: -102.4730327,
        name: "Academy App",
        description: "Place where web developers are hired",
        price: 789
      },
      {
        ownerId: 3,
        address: "308 Westwood Plaza",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.0702285,
        lng: -118.44455831,
        name: "UCLA",
        description: "Bruin Nation",
        price: 777
      },
      {
        ownerId: 4,
        address: "516 Ocean Rd",
        city: "Santa Barbara",
        state: "California",
        country: "United States of America",
        lat: 34.4182524,
        lng: -119.8489718,
        name: "UCSB",
        description: "Place where gauchos live",
        price: 999
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Academy App', 'UCLA', 'UCSB']}
    }, {});
  }
};

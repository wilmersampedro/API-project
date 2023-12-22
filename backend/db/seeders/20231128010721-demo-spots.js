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
        address: "1223 Disney Lane",
        city: "Fillmore",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Treehouse Guest House Farm",
        description: "A tree house nestled within an orange and avocado orchard and surprisingly close to L.A. We usually have seasonal fruits and vegetables to pick and you'll have plenty of privacy and serenity to relax and enjoy.",
        price: 216
      },
      {
        ownerId: 2,
        address: "3817 Euclid Lane",
        city: "Temecula",
        state: "California",
        country: "United States of America",
        lat: 46.7645358,
        lng: -102.4730327,
        name: "Peaceful & Spacious Wine Country Oasis on Vineyard",
        description: "We are pleased to introduce our Peaceful & Spacious Wine Country Oasis!",
        price: 550
      },
      {
        ownerId: 3,
        address: "308 Oceanside Way",
        city: "Malibu",
        state: "California",
        country: "United States of America",
        lat: 34.0702285,
        lng: -118.44455831,
        name: "Malibu Rocky Oaks Vineyard",
        description: "Escape and find yourself on top of the world at Malibu Rocky Oaks Estate in Malibu California. Large Vineyard gates and a perfectly groomed driveway bring you to this Tuscan-style ocean view villa in Malibu.",
        price: 2855
      },
      {
        ownerId: 4,
        address: "516 Pescadero Rd",
        city: "Santa Barbara",
        state: "California",
        country: "United States of America",
        lat: 34.4182524,
        lng: -119.8489718,
        name: "SoCal CASTLE!",
        description: "Escape to 7 rural acres of fresh air and quiet nights at our modern day castle.",
        price: 94
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Treehouse Guest House Farm', 'Peaceful & Spacious Wine Country Oasis on Vineyard', 'Malibu Rocky Oaks Vineyard', 'SoCal CASTLE!']}
    }, {});
  }
};

'use strict';

const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/6269b3a19f67fd137a262d0a_A%20Logo%20Main%20-%20Red.svg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
        preview: false
      },
      {
        spotId: 3,
        url: "https://s3.amazonaws.com/cms.ipressroom.com/173/files/20198/5d72b4772cfac209ff04c634_Royce+Quad/Royce+Quad_hero.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://www.collegetransitions.com/wp-content/uploads/2022/05/ucsb-1-e1652888795673.png",
        preview: false
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

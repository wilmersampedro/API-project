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
        url: "https://a0.muscache.com/im/pictures/a3bf55c6-4a8e-4fe4-b445-09b5602c9dd1.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/b0eba6be-f8b0-4dd1-88b0-bdf327d38ab8.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/660131db-c196-469e-be10-7039706ef0ba.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/c2414bf9-fa1a-4ce9-a610-97bdc0df9045.jpg?im_w=1440",
        preview: true
      },
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/a88972a4-c4df-4e66-b39d-17c3600df578.jpg?im_w=1440",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-730521968827915562/original/87804030-0d9a-4608-87d8-bbc6fe9475b0.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-578233949138601859/original/1a65f3bb-9166-4e4c-811b-2d56c54484d9.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-578233949138601859/original/4ee8509c-d863-4485-843b-6ae27b22dc10.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-578233949138601859/original/f9a603ba-86ce-43cf-b387-95c5b1ba016f.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-578233949138601859/original/67e4ca24-5547-469a-af4e-72b36663ceb3.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47715077/original/f8153a63-723c-42ab-9673-9dc0321c13b4.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47715077/original/50609344-a51d-4b01-982d-d067237259cc.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47715077/original/1ded191b-f448-4596-bfab-23d77645aee2.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47715077/original/731d71df-5291-46d8-a782-0f0044b4f524.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47715077/original/c677b153-33c4-4169-97be-0cde38e068b0.jpeg?im_w=1440",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/06e29af9-7ae8-47a9-949e-126983c59f88.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/d6304f56-b8e4-46d7-a9b2-d81c9fd664de.jpg?im_w=1440",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/3165ba2b-b366-4a3a-9ba7-55231ab4d5fa.jpg?im_w=1440",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/823656ce-57b5-47c5-b2f8-cb468d37f1f8.jpg?im_w=1200",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/2c7d69a2-5170-4310-a991-8a6632ccd725.jpg?im_w=1440",
        preview: true
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

/* eslint-disable @typescript-eslint/camelcase */

import faker from 'faker';

/**
 * @return {Object} The main object
 **/
export const getOrderObject = () => {
  return {
    title: faker.name.findName(),
    bookingDate: 1554284950000,
    address: {
      city: faker.address.city,
      country: faker.address.country,
      street: faker.address.streetAddress,
      zip: faker.address.zipCode,
    },
    customer: {
      email: faker.internet.email(),
      name: faker.name.findName(),
      phone: faker.phone,
    },
    uid: faker.random.uuid(),
  };
};

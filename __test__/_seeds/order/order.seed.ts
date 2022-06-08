/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @return {Object} The main object
 **/
export const getOrderObject = () => {
  const {faker} = require('@faker-js/faker');
  return {
    title: faker.name.findName(),
    bookingDate: faker.date.past(),
    address: {
      city: faker.address.city(),
      country: faker.address.country(),
      street: faker.address.streetAddress(),
      zip: faker.address.zipCode(),
    },
    customer: {
      email: faker.internet.email(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
    },
  };
};

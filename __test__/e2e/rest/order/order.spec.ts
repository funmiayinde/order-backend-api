/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest from 'supertest';
import app from '../../../../src/app';
import { CREATED, OK } from '../../../../src/utils/codes';
import { expect } from 'chai';
import { TEST_ORDER_URL, TEST_TOKEN } from '../../routes';
import { getOrderObject } from '../../../_seeds/order/order.seed';
import { get } from 'lodash';

let data: any = null;
// Parent block
test('Should test create order', async () => {
  const response = await supertest(await app)
    .post(TEST_ORDER_URL)
    .send({ ...getOrderObject() })
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(CREATED);
  console.log('response:::', response.body);
  data = response.body.data;
  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Object);
  expect(response.body.data).have.property('title');
});

test('Should test get orders', async () => {
  const response = await supertest(await app)
    .get(TEST_ORDER_URL)
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Array);
});

test('Should test get orders by customer email', async () => {
    console.log('get-order-by-email:::', data);
  const response = await supertest(await app)
    .get(TEST_ORDER_URL)
    .query({
      filters: JSON.stringify([
        {
          field: 'customer.email',
          condition: '==',
          value: get(data, ['customer', 'email']),
        },
      ]),
    })
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Array);
  expect(response.body.data[0]).instanceof(Object);
  expect(response.body.data[0]).have.property('title');
  expect(response.body.data[0]).have.property('bookingDate');
  expect(response.body.data[0]).have.property('uid');
  expect(response.body.data[0]).have.property('customer');
  expect(response.body.data[0].customer).instanceOf(Object);
  expect(response.body.data[0].customer).have.property('email');
  expect(response.body.data[0].customer.email).equal(`${get(data, ['customer', 'email'])}`);
});

test('Should test get order', async () => {
  console.log('get-order-data:::', data);
  const response = await supertest(await app)
    .get(`${TEST_ORDER_URL}/${data.uid}`)
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Object);
  expect(response.body.data).have.property('title');
  expect(response.body.data).have.property('uid');
  expect(response.body.data).have.property('customer');
  expect(response.body.data.customer).instanceOf(Object);
  expect(response.body.data).have.property('address');
  expect(response.body.data.address).instanceOf(Object);
  expect(response.body.data.customer).have.property('email');
  expect(response.body.data.customer.email).equal(`${get(data, ['customer', 'email'])}`);
});

test('Should test update order', async () => {
  console.log('update-order-data:::', data);
  const response = await supertest(await app)
    .put(`${TEST_ORDER_URL}/${data.uid}`)
    .send({ title: 'Change Title' })
    .set('Authorization', TEST_TOKEN)
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(OK);

  expect(response.body).instanceof(Object);
  expect(response.body._meta).instanceof(Object);
  expect(response.body._meta).have.property('status_code');
  expect(response.body._meta).have.property('success');
  expect(response.body.data).instanceof(Object);
  expect(response.body.data).have.property('title');
  expect(response.body.data.title).equal('Change Title');
  expect(response.body.data).have.property('uid');
  expect(response.body.data).have.property('customer');
  expect(response.body.data.customer).instanceOf(Object);
  expect(response.body.data).have.property('address');
  expect(response.body.data.address).instanceOf(Object);
  expect(response.body.data.customer).have.property('email');
  expect(response.body.data.customer.email).equal(`${get(data, ['customer', 'email'])}`);
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest, { SuperTest } from 'supertest';
import app from '../../../../src/app';
import {  CREATED, OK } from '../../../../src/utils/codes';
import { expect } from 'chai';
import { TEST_ORDER_URL } from '../../routes';
import { getOrderObject as getOrderObject } from '../../../_seeds/order/order.seed';

let server: SuperTest<any>;
let responseObj: any = null;
// Parent block
describe('Setup For Order Test', () => {
    before(async () => {
        server = supertest(await app);
    });
    describe('Order Endpoint Test ' + TEST_ORDER_URL, () => {
        it('Should test create order', async () => {
            const response = await server.post(TEST_ORDER_URL)
                .send({ ...getOrderObject() })
                .set('x-api-key', process.env.API_KEY || 'OrderAPIKey')
                .expect('Content-type', 'application/json; charset=utf-8')
                .expect(CREATED);
            responseObj = response.body.data;
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Object);
            expect(response.body.data).have.property('name');
        });

        it('Should test get Orders', async () => {
            const response = await server.get(TEST_ORDER_URL)
                .set('x-api-key', process.env.API_KEY || 'OrderAPIKey')
                .expect(OK);
                console.log('responseObj::', responseObj);
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Array);
        });

    });

});


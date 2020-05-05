const app = require('../src/server/server')
const request = require('supertest')

describe('GET /', () => {
    test('it has a status of 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});
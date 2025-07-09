const request = require('supertest');
const app = require('../app');

describe('Auth - регистрация', () => {
    it('Успешная регистрация нового пользователя', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: `test_${Date.now()}@mail.com`,
                password: '123456',
                name: 'TestUser',
                role: 'client'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email');
    })
})
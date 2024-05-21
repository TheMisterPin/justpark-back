import request from 'supertest'
import app from '../src/routes/router'
import { mockAdmin } from './mocks'

let accessToken: string

beforeAll(async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({ email: mockAdmin.email, password: mockAdmin.password })

  accessToken = response.body.accessToken
})

describe('GET /parkings', () => {
  it('should return 200 if succefull', async () => {
    const response = await request(app).get('/parkings')
    expect(response.status).toBe(200)
  })
})

describe('GET /parkings/:parkingID', () => {
  it('should return 404 if not found', async () => {
    const response = await request(app).get('/parkings/0')
    expect(response.status).toBe(404)
  })
  it('should return 200 if succefull', async () => {
    const response = await request(app).get('/parkings/2')
    expect(response.status).toBe(200)
  })
})

describe('POST /parkings/', () => {
  it('should access protected route with valid token', async () => {
    const response = await request(app)
      .post('/parkings/')
      .set('Authorization', `${accessToken}`)
      .send({ name : "parking3" , location: "city2", totalSpaces : 100  })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('parking')
  })
})


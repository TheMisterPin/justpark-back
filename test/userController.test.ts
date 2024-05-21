import request from 'supertest'
import app from '../src/routes/router'
import cleanup from '../src/utils/cleanup'
import { mockAdmin } from './mocks'

describe('POST /auth/signup', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/auth/signup').send({ email: 'test@example.com' })

    expect(response.status).toBe(400)
    expect(response.body).toBe('Missing required fields')
  })

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'newuser@example.com', password: 'password123', name: 'New User' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User created successfully, welcome New User')
    await cleanup('newuser@example.com')
  })

  it('should return 409 if email is already in use', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: mockAdmin.email, password: 'password123', name: mockAdmin.name })

    expect(response.status).toBe(409)
    expect(response.body).toBe('Email already in use')
  })
})

describe('POST /auth/login', () => {
  it('should return 404 if user is not found', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrongemail@test.com', password: mockAdmin.password })

    expect(response.status).toBe(404)
    expect(response.body).toBe('User not found')
  })

  it('should return 401 if password is incorrect', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: mockAdmin.email, password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.body).toBe('Invalid credentials')
  })

  it('should login successfully with correct credentials and return an access token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: mockAdmin.email, password: mockAdmin.password })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
  })
})

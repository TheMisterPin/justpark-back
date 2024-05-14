import request from 'supertest'
import app from '../src/routes/router'

describe('POST /auth/signup', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/auth/signup').send({ email: 'test@example.com' }) // Missing name and password

    expect(response.status).toBe(400)
    expect(response.body).toBe('Missing required fields')
  })

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'newuser@example.com', password: 'password123', name: 'New User' })

    expect(response.status).toBe(200)
    expect(response.body).toContain('User created successfully')
  })

  it('should return 409 if email is already in use', async () => {
    // First, create a user
    await request(app)
      .post('/auth/signup')
      .send({ email: 'existinguser@example.com', password: 'password123', name: 'Existing User' })

    // Try to create another user with the same email
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'existinguser@example.com', password: 'password456', name: 'Another User' })

    expect(response.status).toBe(409)
    expect(response.body).toBe('Email already in use')
  })
})

describe('POST /auth/login', () => {
  it('should return 404 if user is not found', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' })

    expect(response.status).toBe(404)
    expect(response.body).toBe('User not found')
  })

  it('should return 401 if password is incorrect', async () => {
    // First, create a user
    await request(app)
      .post('/auth/signup')
      .send({ email: 'existinguser@example.com', password: 'password123', name: 'Existing User' })

    // Attempt to login with incorrect password
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'existinguser@example.com', password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.body).toBe('Invalid credentials')
  })

  it('should login successfully with correct credentials and return an access token', async () => {
    // First, create a user
    await request(app)
      .post('/auth/signup')
      .send({ email: 'loginuser@example.com', password: 'password123', name: 'Login User' })

    // Attempt to login with correct credentials
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'loginuser@example.com', password: 'password123' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
  })
})

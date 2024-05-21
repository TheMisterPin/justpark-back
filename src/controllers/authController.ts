import { PrismaClient } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import express from 'express'
import * as jwt from 'jsonwebtoken'
import { sendPasswordResetEmail } from './utils/emailService'

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET as string

export const register = async (req: express.Request, res: express.Response) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json('Missing required fields')
  }

  try {
    const userExist = await prisma.user.findUnique({ where: { email } })
    if (userExist) {
      return res.status(409).json('Email already in use')
    }

    const hashedPassword = hashSync(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(200).json({ message: `User created successfully, welcome ${newUser.name}` })
  } catch (error) {
    console.error('Error during user registration:', error)
    res.status(500).json('An error occurred while creating the user')
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json('User not found')
    }

    const correctPassword = compareSync(password, user.password)
    if (!correctPassword) {
      return res.status(401).json('Invalid credentials')
    }

    const token = await attachToken(user.id)
    res.status(200).json({ message: `Welcome Back ${user.name}`, accessToken: token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json('An error occurred during login')
  }
}

export const logout = async (req: express.Request, res: express.Response) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(400).json({ message: 'No token provided' })
  }

  try {
    const deletedAuth = await prisma.auth.deleteMany({
      where: { sessionToken: token }
    })

    if (deletedAuth.count === 0) {
      return res.status(400).json({ message: 'Token not found' })
    }

    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to logout', error: error.message })
  }
}
export const lostPassword = async (req: express.Request, res: express.Response) => {
  const { email } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json('User not found')
    }

    const token = await attachPasswordToken(user.id)
    sendPasswordResetEmail(user.email, token)

    res.status(200).json({ message: `Reset password link sent to ${user.email}` })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    res.status(500).json('An error occurred while sending the password reset email')
  }
}
export const resetPassword = async (req: express.Request, res: express.Response) => {
  const { passwordToken } = req.params
  const { password } = req.body

  try {


    const hashedPassword = hashSync(password, 10)
    const auth = await prisma.auth.findFirst({
      where: { passwordToken }
    })
    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hashedPassword }
    })
    await prisma.auth.deleteMany({ where: { passwordToken } })
    res.status(200).json({ message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json('An error occurred during password reset')
  }
}
async function attachToken(userID: number): Promise<string> {
  const token = jwt.sign({ userID }, secret, { expiresIn: '15min' })

  const existingAuth = await prisma.auth.findUnique({
    where: { userId: userID }
  })

  if (existingAuth) {
    await prisma.auth.update({
      where: { userId: userID },
      data: { sessionToken: token }
    })
  } else {
    await prisma.auth.create({
      data: {
        sessionToken: token,
        user: {
          connect: { id: userID }
        }
      }
    })
  }

  return token
}
async function attachPasswordToken(userID: number): Promise<string> {
  const passwordToken = jwt.sign({ userID }, secret, { expiresIn: '1d' })

  const existingAuth = await prisma.auth.findUnique({
    where: { userId: userID }
  })

  if (existingAuth) {
    await prisma.auth.update({
      where: { userId: userID },
      data: { passwordToken: passwordToken }
    })
  } else {
    await prisma.auth.create({
      data: {
        passwordToken: passwordToken,
        user: {
          connect: { id: userID }
        }
      }
    })
  }

  return passwordToken
}

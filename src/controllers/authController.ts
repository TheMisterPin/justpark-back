import { PrismaClient } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import express from 'express'
import * as jwt from 'jsonwebtoken'

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

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    })

    res.status(200).json(`User created successfully, welcome ${newUser.name}`)
  } catch (error) {
    res.status(500).json('An error occurred while creating the user')
    console.error('Error during user registration:', error)
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json('Missing required fields')
  }

  try {
    const userExist = await prisma.user.findUnique({ where: { email } })
    if (!userExist) {
      return res.status(404).json('User not Found')
    }
    const correctPassword = compareSync(password, userExist.password)
    if (!correctPassword) {
      return res.status(401).json('Invalid password')
    }
    const token = jwt.sign({ userID: userExist.id }, secret, { expiresIn: '1h' })

    res.status(200).json({
      message: `User logged in successfully, welcome back ${userExist.name}`,
      token: token
    })
  } catch (error) {
    res.status(500).json('An error occurred while logging in')
    console.error('Error during user login:', error)
  }
}

export const logout = async (req: express.Request, res: express.Response) => {}

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

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json('User not found')
    }

    const correctPassword = compareSync(password, user.password)
    if (!correctPassword) {
      return res.status(401).json('Invalid credentials')
    }

    const accessToken = jwt.sign({ userID: user.id, role: user.role }, secret, { expiresIn: '23m' })
    

    res.status(200).json({ accessToken })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json('An error occurred during login')
  }
}



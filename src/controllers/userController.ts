import express from 'express'

export const currentUser = async (req: express.Request, res: express.Response) => {
  res.json(req.user)
}


import express from 'express'
import jwt from 'jsonwebtoken'
import { ContextFunction, Context } from 'apollo-server-core'

import { getDatabase } from './database'
import { User } from './entities/User'

type ExpressContext = {
  req: express.Request
  res: express.Response
}

export type GetContext = ContextFunction<ExpressContext, Context>

export const getContext: GetContext = async ({ req }) => {
  const db = await getDatabase()
  const authorization = req?.get('authorization')

  let user
  if (authorization) {
    try {
      const token = authorization.replace('Bearer ', '')
      const decoded = jwt.verify(token, 'super_secret') as { id: number }
      user = await db.findOne(User, { id: decoded.id })
    } catch {}
  }

  return {
    db,
    user,
  }
}

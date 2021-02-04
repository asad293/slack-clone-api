import { MikroORM } from '@mikro-orm/core'

import config from './mikro-orm.config'
import { Database } from './types'

export type GetDatabase = () => Database

export const getDatabase = async () => {
  const { em } = await MikroORM.init(config)
  return em
}

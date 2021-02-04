import { MikroORM } from '@mikro-orm/core'
import path from 'path'

import { IS_PROD } from './constants'

import { User } from './entities/User'
import { Channel } from './entities/Channel'
import { Message } from './entities/Message'
import { Workspace } from './entities/Workspace'

export default {
  entities: [User, Channel, Message, Workspace],
  dbName: 'slack',
  type: 'postgresql',
  user: 'postgres',
  password: '1234',
  baseDir: __dirname,
  debug: !IS_PROD,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.ts$/,
  },
} as Parameters<typeof MikroORM.init>[0]

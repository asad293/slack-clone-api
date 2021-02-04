import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { User } from './entities/User'

export type Database = EntityManager<any> &
  EntityManager<IDatabaseDriver<Connection>>

export type Context = {
  db: Database
  user?: User
}

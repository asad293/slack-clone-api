import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
import { Channel } from './Channel'
import { Message } from './Message'
import { User } from './User'

@ObjectType()
@Entity()
export class Workspace {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field(() => Date)
  @Property({ type: 'date' })
  createdAt = new Date()

  @Field(() => Date)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date()

  @Field()
  @Property()
  name!: string

  @Field()
  @Property()
  link!: string

  @Field(() => User)
  @OneToOne(() => User)
  owner!: User

  @Field()
  isOwner!: boolean

  @Field(() => [User])
  @ManyToMany(() => User, 'workspaces')
  members!: User

  @Field(() => [Channel])
  @OneToMany(() => Channel, 'workspace')
  channels = new Collection<Channel>(this)

  @Field(() => [Message])
  @OneToMany(() => Message, 'workspace')
  messages = new Collection<Message>(this)

  constructor(name: string, link: string) {
    this.name = name
    this.link = link
  }
}

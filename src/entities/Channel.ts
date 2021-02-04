import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
import { Message } from './Message'
import { User } from './User'
import { Workspace } from './Workspace'

@ObjectType()
@Entity()
export class Channel {
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
  isPublic!: boolean

  @Field()
  isOwner!: boolean

  @Field(() => User)
  @ManyToOne(() => User)
  owner!: User

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace!: Workspace

  @Field(() => [User])
  @ManyToMany(() => User, user => user.channels)
  members = new Collection<User>(this)

  @Field(() => [Message])
  @OneToMany(() => Message, 'channel')
  messages = new Collection<Message>(this)

  constructor(name: string, isPublic: boolean) {
    this.name = name
    this.isPublic = isPublic
  }
}

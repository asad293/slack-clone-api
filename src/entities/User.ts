import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
import { Channel } from './Channel'
import { Message } from './Message'
import { Workspace } from './Workspace'

@ObjectType()
@Entity()
export class User {
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
  displayName!: string

  @Field(() => String)
  @Property({ type: 'text', unique: true })
  email!: string

  @Property()
  password!: string

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  token: string

  @Field(() => [Workspace])
  @ManyToMany(() => Workspace, 'members', { owner: true })
  workspaces = new Collection<Workspace>(this)

  @Field(() => [Channel])
  @ManyToMany(() => Channel, 'members', { owner: true })
  channels = new Collection<Channel>(this)

  @Field(() => [Message])
  @OneToMany(() => Message, 'user')
  messages = new Collection<Message>(this)

  constructor(displayName: string, email: string, password: string) {
    this.displayName = displayName
    this.email = email
    this.password = password
  }
}

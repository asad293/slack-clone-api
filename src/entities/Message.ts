import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
import { Channel } from './Channel'
import { User } from './User'
import { Workspace } from './Workspace'

@ObjectType()
@Entity()
export class Message {
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
  @Property({ type: 'text' })
  text!: string

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace!: Workspace

  @Field(() => Channel)
  @ManyToOne(() => Channel, { nullable: true })
  channel?: Channel

  constructor(text: string, user: User, workspace: Workspace, channel?: Channel) {
    this.text = text
    this.user = user
    this.workspace = workspace
    this.channel = channel
  }
}

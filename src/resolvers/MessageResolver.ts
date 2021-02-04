import {
  Query,
  Ctx,
  Resolver,
  Root,
  FieldResolver,
  Subscription,
  Mutation,
  Arg,
  Field,
  InputType,
  Authorized,
  PubSub,
  Publisher,
  Int,
} from 'type-graphql'
import { Message } from '../entities/Message'
import { User } from '../entities/User'
import { Channel } from '../entities/Channel'
import { Workspace } from '../entities/Workspace'
import { Context } from 'src/types'

@InputType()
class CreateMessageInput {
  @Field()
  text: string

  @Field()
  channelId: number

  @Field()
  workspaceId: number
}

@Resolver(Message)
export default class MessageResolver {
  @FieldResolver(() => User)
  async user(@Root() message: Message, @Ctx() { db }: Context): Promise<User> {
    const user = await db.findOne(User, { id: message.user.id })
    return user as User
  }

  @FieldResolver(() => Channel)
  async channel(
    @Root() message: Message,
    @Ctx() { db }: Context
  ): Promise<Channel> {
    const channel = await db.findOne(Channel, { id: message.channel?.id })
    return channel as Channel
  }

  @FieldResolver(() => Workspace)
  async workspace(
    @Root() message: Message,
    @Ctx() { db }: Context
  ): Promise<Workspace> {
    const workspace = await db.findOne(Workspace, { id: message.workspace?.id })
    return workspace as Workspace
  }

  @Query(() => [Message])
  async messages(@Ctx() { db }: Context): Promise<Message[]> {
    return db.find(Message, {})
  }

  @Authorized()
  @Mutation(() => Message)
  async createMessage(
    @Arg('input') input: CreateMessageInput,
    @Ctx() { db, user }: Context,
    @PubSub('MESSAGE_ADDED') publish: Publisher<Message>
  ): Promise<Message> {
    const message = db.create(Message, {
      text: input.text,
      channel: input.channelId,
      workspace: input.workspaceId,
      user,
    })

    await db.persistAndFlush(message)
    await publish(message)

    return message
  }

  @Subscription({
    topics: 'MESSAGE_ADDED',
    filter: ({ payload, args }) => payload.channel.id === args.channelId,
  })
  messageAdded(
    @Root() message: Message,
    @Arg('channelId', () => Int) _: number
  ): Message {
    return message
  }

  @Subscription({
    topics: 'MESSAGE_REMOVED',
    filter: ({ payload, args }) => payload.channel.id === args.channelId,
  })
  messageRemoved(
    @Root() id: number,
    @Arg('channelId', () => Int) _: number
  ): number {
    return id
  }
}

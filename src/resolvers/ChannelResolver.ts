import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Context } from 'src/types'
import { Channel } from '../entities/Channel'
import { Workspace } from '../entities/Workspace'
import { Message } from '../entities/Message'
import { User } from '../entities/User'

@Resolver(Channel)
export default class ChannelResolver {
  @FieldResolver(() => User)
  async owner(@Root() channel: Channel, @Ctx() { db }: Context): Promise<User> {
    const owner = await db.findOne(User, { id: channel.owner.id })
    return owner as User
  }

  @FieldResolver(() => Boolean)
  async isOwner(
    @Root() channel: Channel,
    @Ctx() { user }: Context
  ): Promise<boolean> {
    return channel.owner.id === user?.id
  }

  @FieldResolver(() => [User])
  async members(
    @Root() channel: Channel,
    @Ctx() { db }: Context
  ): Promise<User[]> {
    return db.find(User, { channels: channel })
  }

  @FieldResolver(() => [Message])
  async messages(
    @Root() channel: Channel,
    @Ctx() { db }: Context
  ): Promise<Message[]> {
    return db.find(Message, { channel })
  }

  @FieldResolver(() => Workspace)
  async workspace(
    @Root() channel: Channel,
    @Ctx() { db }: Context
  ): Promise<Workspace> {
    const workspace = await db.findOne(Workspace, { id: channel.workspace.id })
    return workspace as Workspace
  }

  @Query(() => Channel)
  async channel(
    @Arg('id') id: number,
    @Ctx() { db }: Context
  ): Promise<Channel> {
    const channel = await db.findOne(Channel, { id })
    return channel as Channel
  }

  @Query(() => [Channel])
  async channels(@Ctx() { db }: Context): Promise<Channel[]> {
    return db.find(Channel, {})
  }
}

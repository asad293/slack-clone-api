import { Context } from 'src/types'
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { User } from '../entities/User'
import { Channel } from '../entities/Channel'
import { Workspace } from '../entities/Workspace'
import { Message } from '../entities/Message'

@InputType()
export class WorkspacesWhere {
  @Field(() => String, { nullable: true })
  name: string

  @Field(() => String, { nullable: true })
  link: string
}

@Resolver(Workspace)
export default class WorkspaceResolver {
  @FieldResolver(() => User)
  async owner(
    @Root() workspace: Workspace,
    @Ctx() { db }: Context
  ): Promise<User> {
    const user = await db.findOne(User, { id: workspace.owner.id })
    return user as User
  }

  @FieldResolver(() => Boolean)
  async isOwner(
    @Root() workspace: Workspace,
    @Ctx() { user }: Context
  ): Promise<boolean> {
    return workspace.owner.id === user?.id
  }

  @FieldResolver(() => [Channel])
  async channels(
    @Root() workspace: Workspace,
    @Ctx() { db }: Context
  ): Promise<Channel[]> {
    return db.find(Channel, { workspace })
  }

  @FieldResolver(() => [Message])
  async messages(
    @Root() workspace: Workspace,
    @Ctx() { db }: Context
  ): Promise<Message[]> {
    return db.find(Message, { workspace })
  }

  @Query(() => Workspace)
  async workspace(
    @Arg('id') id: number,
    @Ctx() { db }: Context
  ): Promise<Workspace> {
    const workspace = await db.findOne(Workspace, { id })
    return workspace as Workspace
  }

  @Query(() => [Workspace])
  async workspaces(
    @Arg('where', { nullable: true }) where: WorkspacesWhere,
    @Ctx() { db }: Context
  ): Promise<Workspace[]> {
    if (where) {
      return db.find(Workspace, { ...where })
    }

    return db.find(Workspace, {})
  }
}

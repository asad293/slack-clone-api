import {
  Query,
  Ctx,
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { User } from '../entities/User'
import { Channel } from '../entities/Channel'
import { Workspace } from '../entities/Workspace'
import { Message } from '../entities/Message'
import { Context } from 'src/types'
import { WorkspacesWhere } from './WorkspaceResolver'

@InputType()
class RegisterInput {
  @Field()
  displayName: string

  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
class LoginInput {
  @Field()
  email: string

  @Field()
  password: string
}

@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => [Workspace])
  async workspaces(
    @Root() user: User,
    @Ctx() { db }: Context,
    @Arg('where') where: WorkspacesWhere
  ): Promise<Workspace[]> {
    if (where) {
      return db.find(Workspace, { ...where })
    }
    return db.find(Workspace, { members: user })
  }

  @FieldResolver(() => [Channel])
  async channels(
    @Root() user: User,
    @Ctx() { db }: Context
  ): Promise<Channel[]> {
    return db.find(Channel, { members: user })
  }

  @FieldResolver(() => [Message])
  async messages(
    @Root() user: User,
    @Ctx() { db }: Context
  ): Promise<Message[]> {
    return db.find(Message, { user })
  }

  @Authorized()
  @Query(() => User)
  async user(
    @Arg('id') id: number,
    @Ctx() { db }: Context
  ): Promise<User | null> {
    return db.findOne(User, { id })
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() { user }: Context): Promise<User> {
    return user as User
  }

  @Authorized()
  @Query(() => [User])
  async users(@Ctx() { db }: Context): Promise<User[]> {
    return db.find(User, {})
  }

  @Mutation(() => User)
  async register(
    @Arg('input') input: RegisterInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    const hash = await argon2.hash(input.password)

    const user = db.create(User, {
      displayName: input.displayName,
      email: input.email,
      password: hash,
    })

    await db.persistAndFlush(user)

    const registeredUser = await db.findOne(User, { email: input.email })

    user.token = jwt.sign({ id: registeredUser!.id }, 'super_secret', {
      expiresIn: '3d',
    })

    await db.persistAndFlush(user)

    return user
  }

  @Mutation(() => User)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    const user = await db.findOne(User, { email: input.email })
    if (!user) throw new Error('Email not found')

    const isValid = await argon2.verify(user.password, input.password)
    if (!isValid) throw new Error('Password incorrect')

    user.token = jwt.sign({ id: user.id }, 'super_secret', {
      expiresIn: '3d',
    })

    await db.persistAndFlush(user)

    return user
  }
}

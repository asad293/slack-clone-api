import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import UserResolver from './resolvers/UserResolver'
import ChannelResolver from './resolvers/ChannelResolver'
import WorkspaceResolver from './resolvers/WorkspaceResolver'
import MessageResolver from './resolvers/MessageResolver'
import { getContext } from './context'

const main = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ChannelResolver,
        WorkspaceResolver,
        MessageResolver,
      ],
      validate: false,
      authChecker: ({ context }) => !!context.user,
    }),
    subscriptions: {
      onConnect: () => console.log('Subscriptions onConnect'),
      onDisconnect: () => console.log('Subscriptions onDisconnect'),
    },
    context: getContext,
  })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main()

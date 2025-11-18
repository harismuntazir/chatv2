import { Config, Plugin } from 'payload'
import { Conversations } from './collections/conversations'
import { ChatMessages } from './collections/chat_messages'
import { afterMessageCreate } from './hooks/afterMessageCreate'
import { chatEndpoints } from './endpoints'

export const chatPlugin: Plugin = (config: Config) => {
  // Add collections
  config.collections = [
    ...(config.collections || []),
    {
      ...Conversations,
    },
    {
      ...ChatMessages,
      hooks: {
        afterChange: [afterMessageCreate],
      },
    },
  ]

  // Add endpoints
  config.endpoints = [...(config.endpoints || []), ...chatEndpoints]

  return config
}

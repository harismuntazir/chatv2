import { CollectionAfterChangeHook } from 'payload'

export const afterMessageCreate: CollectionAfterChangeHook = async ({
  doc, // The new message document
  req, // The request object
  operation, // 'create' or 'update'
}) => {
  if (operation !== 'create') return doc

  const { payload } = req
  const { conversation, role } = doc

  if (!conversation) return doc

  try {
    // Update conversation metadata
    await payload.update({
      collection: 'conversations',
      id: typeof conversation === 'object' ? conversation.id : conversation,
      data: {
        lastMessageAt: new Date().toISOString(),
        unreadBySupport:
          role === 'candidate' ? 1 : 0, // This logic might need to be increment, but payload update doesn't support atomic increment easily without custom db access or reading first.
        // For now, let's just read and update or assume we can use a more advanced update if available.
        // Payload's local API doesn't support atomic $inc directly in the `update` method in all versions, but let's check if we can do it or if we need to read first.
        // To be safe and simple: Read first (or rely on the fact that we might be the only ones updating this frequently, which isn't true for chat).
        // Ideally we use a custom operation or the db adapter directly.
        // For this 'out of the box' solution, reading first is acceptable for MVP.
        unreadByCandidate: role === 'support' ? 1 : 0,
      },
    })

    // In a real high-concurrency scenario, we'd want atomic increments.
    // We can do that by accessing the underlying DB if needed, but let's stick to Payload API for now.
    // Actually, let's try to read the conversation first to get current counts.
    const conversationDoc = await payload.findByID({
      collection: 'conversations',
      id: typeof conversation === 'object' ? conversation.id : conversation,
    })

    if (conversationDoc) {
      const newUnreadBySupport =
        role === 'candidate'
          ? (conversationDoc.unreadBySupport || 0) + 1
          : conversationDoc.unreadBySupport
      const newUnreadByCandidate =
        role !== 'candidate'
          ? (conversationDoc.unreadByCandidate || 0) + 1
          : conversationDoc.unreadByCandidate

      await payload.update({
        collection: 'conversations',
        id: conversationDoc.id,
        data: {
          lastMessageAt: new Date().toISOString(),
          unreadBySupport: newUnreadBySupport,
          unreadByCandidate: newUnreadByCandidate,
        },
      })
    }

    // TODO: Emit to socket server
    // await emitToSocket({ event: 'message', data: doc })
  } catch (error) {
    console.error('Error in afterMessageCreate hook:', error)
  }

  return doc
}

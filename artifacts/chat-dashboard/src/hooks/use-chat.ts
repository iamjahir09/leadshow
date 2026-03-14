import { useQueryClient } from "@tanstack/react-query";
import {
  useGetConversations,
  useGetMessages,
  useSendMessage,
  useToggleStatus,
  getGetConversationsQueryKey,
  getGetMessagesQueryKey
} from "@workspace/api-client-react";

export function useChatQueries() {
  const conversationsQuery = useGetConversations();

  return {
    conversationsQuery,
  };
}

export function useChatMutations() {
  const queryClient = useQueryClient();

  const sendMessage = useSendMessage({
    mutation: {
      onSuccess: (data, variables) => {
        // Invalidate specific conversation messages
        queryClient.invalidateQueries({
          queryKey: getGetMessagesQueryKey(variables.data.conversationId),
        });
        // Invalidate conversations to update last message preview and order
        queryClient.invalidateQueries({
          queryKey: getGetConversationsQueryKey(),
        });
      },
    },
  });

  const toggleStatus = useToggleStatus({
    mutation: {
      onSuccess: () => {
        // Invalidate conversations list to reflect updated status
        queryClient.invalidateQueries({
          queryKey: getGetConversationsQueryKey(),
        });
      },
    },
  });

  return {
    sendMessage,
    toggleStatus,
  };
}

export { useGetMessages };

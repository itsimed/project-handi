/**
 * useMessages Hook - Gestion de la messagerie
 * Hook pour lister, envoyer, lire les messages
 */

import { useState, useEffect } from 'react';
import type { Message, Conversation } from '../types';

interface UseMessagesReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

export const useMessages = (): UseMessagesReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations
  const fetchConversations = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock conversations
      const mockConversations: Conversation[] = [];
      setConversations(mockConversations);

      // Calculer le nombre de messages non lus
      const unread = mockConversations.reduce(
        (acc, conv) => acc + conv.unreadCount,
        0
      );
      setUnreadCount(unread);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement des conversations'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages pour une conversation
  const fetchMessages = async (conversationId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API avec conversationId
      console.log('Fetching messages for conversation:', conversationId);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock messages
      const mockMessages: Message[] = [];
      setMessages(mockMessages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement des messages'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (conversationId: string, content: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: 'current-user-id',
        receiverId: 'other-user-id',
        content,
        read: false,
        sentAt: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de l\'envoi du message'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Marquer un message comme lu
  const markAsRead = async (messageId: string): Promise<void> => {
    try {
      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 200));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Auto-fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    setCurrentConversation,
  };
};

import type { ChatMessage } from '@/types/message';

class AgentService {
  async sendMessage(message: ChatMessage): Promise<void> {
    // In a real implementation, this would send a message to an AI agent
  }

  async stopGeneration(): Promise<void> {
    // In a real implementation, this would stop the AI agent's generation
  }

  async regenerateMessage(messageId: string): Promise<void> {
    // In a real implementation, this would trigger message regeneration
  }

  async getMessageHistory(sessionId: string): Promise<ChatMessage[]> {
    // In a real implementation, this would fetch message history from an API
    return [];
  }

  async clearMessageHistory(sessionId: string): Promise<void> {
    // In a real implementation, this would clear message history via API
  }
}

export const agentService = new AgentService();

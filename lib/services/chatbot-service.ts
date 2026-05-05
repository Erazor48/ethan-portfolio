import { intelligentAgent } from '../ai/agent/intelligent-agent';

export class ChatbotService {
  private static instance: ChatbotService;

  private constructor() {
    // No initialization needed - intelligent agent handles everything
  }

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  async generateResponse(messages: { role: string, content: string }[]): Promise<string> {
    return await intelligentAgent.generateResponse(messages);
  }

  async getQuickFacts(): Promise<string[]> {
    return await intelligentAgent.getQuickFacts();
  }

  async searchProjects(query: string): Promise<any[]> {
    return await intelligentAgent.searchProjects(query);
  }

  async getSkillsByCategory(): Promise<Record<string, string[]>> {
    return await intelligentAgent.getSkillsByCategory();
  }
}

export const chatbotService = ChatbotService.getInstance(); 
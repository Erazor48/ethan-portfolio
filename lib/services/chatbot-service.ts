import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { personalData } from '../data/personal-data';
import { githubSyncService } from './github-sync';

export class ChatbotService {
  private static instance: ChatbotService;
  private model: ChatGoogleGenerativeAI;
  private knowledgeBase: string;


  private constructor() {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    this.initializeKnowledgeBase();
  }


  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  private async initializeKnowledgeBase(): Promise<void> {
    try {
      // Synchroniser avec GitHub
      const syncedData = await githubSyncService.syncWithPersonalData();

      // Create structured knowledge base
      this.knowledgeBase = `
PERSONAL INFORMATION:
- Name: ${syncedData.personal.name}
- Age: ${syncedData.personal.age} years old
- Location: ${syncedData.personal.location}
- Bio: ${syncedData.personal.bio}
- Languages: ${syncedData.personal.languages.join(', ')}

TECHNICAL SKILLS:
- Programming Languages: ${syncedData.skills.programming.join(', ')}
- Frameworks: ${syncedData.skills.frameworks.join(', ')}
- Databases: ${syncedData.skills.databases.join(', ')}
- Tools: ${syncedData.skills.tools.join(', ')}
- Soft Skills: ${syncedData.skills.softSkills.join(', ')}

PROFESSIONAL EXPERIENCE:
Current Position:
- Company: ${syncedData.experience.current.company}
- Position: ${syncedData.experience.current.position}
- Period: ${syncedData.experience.current.start.month + '/' + syncedData.experience.current.start.year} – ${syncedData.experience.current.ongoing ? 'Present' : (syncedData.experience.current.end ? syncedData.experience.current.end.month + '/' + syncedData.experience.current.end.year : 'N/A')}
- Description: ${syncedData.experience.current.description}
- Technologies: ${syncedData.experience.current.technologies.join(', ')}

Previous Experience:
${syncedData.experience.previous.map(exp =>
        `- ${exp.company}: ${exp.position} (${exp.start.month + '/' + exp.start.year} – ${exp.ongoing ? 'Present' : (exp.end ? exp.end.month + '/' + exp.end.year : 'N/A')})\n   Description: ${exp.description}\n   Technologies: ${exp.technologies.join(', ')}`
      ).join('\n')}

EDUCATION:
${Array.isArray(syncedData.education) ? syncedData.education.map(edu =>
        `- ${edu.degree} (${edu.program}) at ${edu.institution} (${edu.start.month}/${edu.start.year} – ${edu.end ? edu.end.month + '/' + edu.end.year : 'Present'})\n   Field: ${edu.field}\n   Grade: ${edu.grade !== null ? edu.grade : 'N/A'}\n   Technologies: ${edu.technologies.join(', ')}\n   Description: ${edu.description}`
      ).join('\n\n') : ''}

PROJECTS:
${syncedData.projects.map(project =>
        `- ${project.name}: ${project.description}\n   Technologies: ${project.technologies.join(', ')}\n   GitHub: ${project.githubUrl || 'Not available'}\n   Live: ${project.liveUrl || 'Not available'}\n   Featured: ${project.featured ? 'Yes' : 'No'}`
      ).join('\n\n')}

SOCIAL LINKS:
- GitHub: ${syncedData.social.github}
- LinkedIn: ${syncedData.social.linkedin}
- Portfolio: ${syncedData.social.portfolio}
`;
    } catch (error) {
      this.knowledgeBase = "Knowledge base temporarily unavailable. Please try again later if you need acurate data.";
    }
  }

  async generateResponse(messages: { role: string, content: string }[]): Promise<string> {
    const history = messages.slice(0, -1).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant helping to present Ethan Orain, a full-stack developer.

Knowledge base about Ethan:
{knowledgeBase}

Conversation history:
{history}

Instructions:
1. Respond in the user’s language, but default to English when possible.
2. Keep answers concise and clear (3–6 sentences max unless more detail is explicitly asked).
3. Be natural and conversational, avoid unnecessary filler text.
4. Use the knowledge base when relevant.
5. If you don’t know, say so honestly, but provide your reasoning or suggest how the user could find out.
6. Always format responses using Markdown (headings, bullet points, bold, code blocks, etc.). Never send plain unformatted text blocks; ensure every answer is styled and structured with Markdown for clarity.
7. When relevant, highlight Ethan’s projects, skills, or experience.

User question: {lastUserMessage}

Response:`
    );

    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    if (!this.knowledgeBase) {
      await this.initializeKnowledgeBase();
    }

    // ✅ DEBUG : voir ce que le bot reçoit
    console.log("🔎 DEBUG BOT INPUT:");
    console.log("Knowledge base:", this.knowledgeBase);
    console.log("History:", history);
    console.log("Last user message:", lastUserMessage);

    const chain = RunnableSequence.from([
      {
        knowledgeBase: () => this.knowledgeBase,
        history: () => history,
        lastUserMessage: () => lastUserMessage,
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    try {
      const response = await chain.invoke({});
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "Sorry, I'm experiencing a technical issue. Could you please rephrase your question?";
    }
  }

  async getQuickFacts(): Promise<string[]> {
    const syncedData = await githubSyncService.syncWithPersonalData();

    return [
      `${syncedData.personal.name} - ${syncedData.personal.age} ans`,
      `${syncedData.skills.programming.length} langages de programmation`,
      `${syncedData.projects.length} projets`,
      `${syncedData.experience.previous.length + 1} expériences professionnelles`,
    ];
  }

  async searchProjects(query: string): Promise<any[]> {
    const syncedData = await githubSyncService.syncWithPersonalData();

    const searchTerm = query.toLowerCase();
    return syncedData.projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }

  async getSkillsByCategory(): Promise<Record<string, string[]>> {
    const syncedData = await githubSyncService.syncWithPersonalData();
    return syncedData.skills;
  }
}

export const chatbotService = ChatbotService.getInstance(); 
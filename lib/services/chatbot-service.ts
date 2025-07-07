import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { personalData } from '../data/personal-data';
import { githubSyncService } from './github-sync';

export class ChatbotService {
  private static instance: ChatbotService;
  private model: ChatOpenAI;
  private knowledgeBase: string;

  private constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
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
- Duration: ${syncedData.experience.current.duration}
- Description: ${syncedData.experience.current.description}
- Technologies: ${syncedData.experience.current.technologies.join(', ')}

Previous Experience:
${syncedData.experience.previous.map(exp => 
  `- ${exp.company}: ${exp.position} (${exp.duration})
   Description: ${exp.description}
   Technologies: ${exp.technologies.join(', ')}`
).join('\n')}

EDUCATION:
- Degree: ${syncedData.education.degree}
- Institution: ${syncedData.education.institution}
- Year: ${syncedData.education.year}
- Description: ${syncedData.education.description}

PROJECTS:
${syncedData.projects.map(project => 
  `- ${project.name}: ${project.description}
   Technologies: ${project.technologies.join(', ')}
   GitHub: ${project.githubUrl || 'Not available'}
   Live: ${project.liveUrl || 'Not available'}
   Featured: ${project.featured ? 'Yes' : 'No'}`
).join('\n\n')}

SOCIAL LINKS:
- GitHub: ${syncedData.social.github}
- LinkedIn: ${syncedData.social.linkedin}
- Portfolio: ${syncedData.social.portfolio}
`;
  }

  async generateResponse(userMessage: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant helping to present Ethan Orain, a full-stack developer.

Knowledge base about Ethan:
{knowledgeBase}

Instructions:
1. Always respond in English
2. Be natural and conversational
3. Use the knowledge base information to answer
4. If you don't know something, say so honestly
5. Can suggest specific projects or skills based on the question

User question: {userMessage}

Response:`
    );

    const chain = RunnableSequence.from([
      {
        knowledgeBase: () => this.knowledgeBase,
        userMessage: (input: { userMessage: string }) => input.userMessage,
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    try {
      const response = await chain.invoke({ userMessage });
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
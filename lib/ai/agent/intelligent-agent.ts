import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { mcpTools } from '../tools/mcp-tools';
import { webTools } from '../tools/web-tools';
import { ingestTools } from '../tools/ingest-tools';
import { ragSystem } from '../../rag/rag-system';
import { mainAgentPrompt, fallbackPrompt } from './prompts';

export class IntelligentAgent {
    private static instance: IntelligentAgent;
    private model: ChatGoogleGenerativeAI;
    private isInitialized = false;

    private constructor() {
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash-lite",
            temperature: 0.7,
            apiKey: process.env.GOOGLE_API_KEY,
        });
    }

    static getInstance(): IntelligentAgent {
        if (!IntelligentAgent.instance) {
            IntelligentAgent.instance = new IntelligentAgent();
        }
        return IntelligentAgent.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        // Initialiser le RAG seulement s'il n'est pas déjà initialisé
        if (!ragSystem.isInitialized) {
            await ragSystem.initialize();
        }
        this.isInitialized = true;
        console.log('Intelligent agent initialized with', [...mcpTools, ...webTools, ...ingestTools].length, 'tools');
    }

    async generateResponse(messages: { role: string, content: string }[]): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

        try {
            const relevantContext = await ragSystem.getRelevantContext(lastUserMessage);
            const toolsList = [...mcpTools, ...webTools, ...ingestTools];

            const chain = RunnableSequence.from([
                {
                    context: () => relevantContext,
                    tools: () => toolsList.map(tool => `${tool.name}: ${tool.description}`).join('\n'),
                    input: () => lastUserMessage,
                },
                mainAgentPrompt,
                this.model,
                new StringOutputParser(),
            ]);

            return await chain.invoke({});
        } catch (error) {
            console.error('Error generating response:', error);

            const fallbackContext = await ragSystem.getRelevantContext(lastUserMessage, 1500);
            const fallbackChain = RunnableSequence.from([
                {
                    context: () => fallbackContext,
                    input: () => lastUserMessage,
                },
                fallbackPrompt,
                this.model,
                new StringOutputParser(),
            ]);

            return await fallbackChain.invoke({});
        }
    }

    async getQuickFacts(): Promise<string[]> {
        const syncedData = await import('../../services/github-sync').then(m => m.githubSyncService.syncWithPersonalData());
        return [
            `${syncedData.personal.name} - ${syncedData.personal.age} years old`,
            `${syncedData.skills.programming.length} programming languages`,
            `${syncedData.projects.length} projects`,
            `${syncedData.experience.previous.length + 1} professional experiences`,
        ];
    }

    async searchProjects(query: string): Promise<any[]> {
        const results = await ragSystem.searchByType('project', query);
        return results.map(result => ({
            name: result.metadata.title,
            description: result.content,
            technologies: result.metadata.technologies || []
        }));
    }

    async getSkillsByCategory(): Promise<Record<string, string[]>> {
        const syncedData = await import('../../services/github-sync').then(m => m.githubSyncService.syncWithPersonalData());
        return syncedData.skills;
    }
}

export const intelligentAgent = IntelligentAgent.getInstance();

import { githubSyncService } from '../services/github-sync';

// Simple in-memory search implementation for now
// We'll use a basic text matching approach instead of vector embeddings

export interface RAGDocument {
    content: string;
    metadata: {
        type: 'profile' | 'project' | 'experience' | 'education' | 'skills' | 'note' | 'transcript' | 'url';
        id: string;
        title?: string;
        technologies?: string[];
        category?: string;
        sourceUrl?: string;
        temporary?: boolean;
    };
}

export class RAGSystem {
    private documents: RAGDocument[] = [];
    public isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            const syncedData = await githubSyncService.syncWithPersonalData();
            const staticDocuments = this.createDocuments(syncedData);

            // Garder les documents existants (temporaires) et ajouter les nouveaux
            this.documents = [...this.documents, ...staticDocuments];

            this.isInitialized = true;
            console.log('RAG system initialized with', this.documents.length, 'documents');
        } catch (error) {
            console.error('Error initializing RAG system:', error);
            throw error;
        }
    }

    private createDocuments(syncedData: any): RAGDocument[] {
        const documents: RAGDocument[] = [];

        // Profile document
        documents.push({
            content: `Name: ${syncedData.personal.name}\nAge: ${syncedData.personal.age} years old\nLocation: ${syncedData.personal.location}\nBio: ${syncedData.personal.bio}\nLanguages: ${syncedData.personal.languages.join(', ')}`,
            metadata: {
                type: 'profile',
                id: 'profile',
                title: 'Personal Profile'
            }
        });

        // Skills documents by category
        Object.entries(syncedData.skills).forEach(([category, skills]) => {
            documents.push({
                content: `${category.charAt(0).toUpperCase() + category.slice(1)} Skills: ${(skills as string[]).join(', ')}`,
                metadata: {
                    type: 'skills',
                    id: `skills_${category}`,
                    category,
                    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Skills`
                }
            });
        });

        // Current experience
        documents.push({
            content: `Current Position: ${syncedData.experience.current.position} at ${syncedData.experience.current.company}\nPeriod: ${syncedData.experience.current.start.month}/${syncedData.experience.current.start.year} - Present\nDescription: ${syncedData.experience.current.description}\nTechnologies: ${syncedData.experience.current.technologies.join(', ')}`,
            metadata: {
                type: 'experience',
                id: 'current_experience',
                title: 'Current Experience',
                technologies: syncedData.experience.current.technologies
            }
        });

        // Previous experiences
        syncedData.experience.previous.forEach((exp: any, index: number) => {
            documents.push({
                content: `Previous Position: ${exp.position} at ${exp.company}\nPeriod: ${exp.start.month}/${exp.start.year} - ${exp.ongoing ? 'Present' : (exp.end ? exp.end.month + '/' + exp.end.year : 'N/A')}\nDescription: ${exp.description}\nTechnologies: ${exp.technologies.join(', ')}`,
                metadata: {
                    type: 'experience',
                    id: `previous_experience_${index}`,
                    title: `Previous Experience - ${exp.company}`,
                    technologies: exp.technologies
                }
            });
        });

        // Education
        if (Array.isArray(syncedData.education)) {
            syncedData.education.forEach((edu: any, index: number) => {
                documents.push({
                    content: `Education: ${edu.degree} (${edu.program}) at ${edu.institution}\nPeriod: ${edu.start.month}/${edu.start.year} - ${edu.end ? edu.end.month + '/' + edu.end.year : 'Present'}\nField: ${edu.field}\nGrade: ${edu.grade !== null ? edu.grade : 'N/A'}\nTechnologies: ${edu.technologies.join(', ')}\nDescription: ${edu.description}`,
                    metadata: {
                        type: 'education',
                        id: `education_${index}`,
                        title: `Education - ${edu.institution}`,
                        technologies: edu.technologies
                    }
                });
            });
        }

        // Projects
        syncedData.projects.forEach((project: any, index: number) => {
            documents.push({
                content: `Project: ${project.name}\nDescription: ${project.description}\nTechnologies: ${project.technologies.join(', ')}\nGitHub: ${project.githubUrl || 'Not available'}\nLive: ${project.liveUrl || 'Not available'}\nFeatured: ${project.featured ? 'Yes' : 'No'}`,
                metadata: {
                    type: 'project',
                    id: `project_${index}`,
                    title: project.name,
                    technologies: project.technologies
                }
            });
        });

        return documents;
    }

    // Add a single document dynamically
    async addDocument(doc: RAGDocument): Promise<void> {
        // Remove previous version of the same user-uploaded file to avoid duplicates
        if (doc.metadata.temporary && doc.metadata.title) {
            const before = this.documents.length;
            this.documents = this.documents.filter(
                d => !(d.metadata.temporary && d.metadata.title === doc.metadata.title)
            );
            if (this.documents.length < before) {
                console.log(`RAG: Replaced duplicate "${doc.metadata.title}"`);
            }
        }
        this.documents.push(doc);
        console.log(`RAG: Added "${doc.metadata.title || doc.metadata.id}" (${doc.content.length} chars). Total: ${this.documents.length}`);
    }

    // Add multiple documents dynamically
    async addDocuments(docs: RAGDocument[]): Promise<void> {
        this.documents.push(...docs);
        console.log(`RAG: Added ${docs.length} documents. Total: ${this.documents.length}`);
    }

    // Helper to construct and add a document from text
    async addTextDocument(params: { content: string; type?: RAGDocument['metadata']['type']; id?: string; title?: string; technologies?: string[]; sourceUrl?: string; temporary?: boolean; }): Promise<RAGDocument> {
        const id = params.id || `dyn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const doc: RAGDocument = {
            content: params.content,
            metadata: {
                type: params.type || 'note',
                id,
                title: params.title,
                technologies: params.technologies,
                sourceUrl: params.sourceUrl,
                temporary: params.temporary,
            }
        };
        await this.addDocument(doc);
        return doc;
    }

    async search(query: string, k: number = 5, filter?: { type?: string; category?: string }): Promise<any[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        console.log(`RAG: Searching for "${query}" with ${this.documents.length} total documents`);

        const searchTerm = query.toLowerCase();
        let filteredDocs = this.documents;

        // Apply filters
        if (filter) {
            if (filter.type) {
                filteredDocs = filteredDocs.filter(doc => doc.metadata.type === filter.type);
            }
            if (filter.category) {
                filteredDocs = filteredDocs.filter(doc => doc.metadata.category === filter.category);
            }
        }

        // Simple text matching with relevance scoring
        const results = filteredDocs
            .map(doc => {
                const contentLower = doc.content.toLowerCase();
                const titleLower = (doc.metadata.title || '').toLowerCase();

                // Calculate simple relevance score
                let score = 0;
                const words = searchTerm.split(' ');

                words.forEach(word => {
                    if (contentLower.includes(word)) score += 1;
                    if (titleLower.includes(word)) score += 2; // Title matches are more important
                    if (doc.metadata.technologies?.some(tech => tech.toLowerCase().includes(word))) {
                        score += 1.5; // Technology matches are important
                    }
                });

                return { ...doc, score };
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, k);

        console.log(`RAG: Found ${results.length} relevant documents`);
        results.forEach((result, i) => {
            console.log(`RAG: Result ${i + 1}: "${result.metadata.title || result.metadata.id}" (score: ${result.score})`);
        });

        return results;
    }

    async getRelevantContext(query: string, maxTokens: number = 2000): Promise<string> {
        const results = await this.search(query, 8);

        let context = '';
        let currentTokens = 0;

        for (const result of results) {
            const estimatedTokens = result.content.split(' ').length * 1.3; // Rough estimation

            if (currentTokens + estimatedTokens > maxTokens) {
                break;
            }

            context += `\n\n${result.content}`;
            currentTokens += estimatedTokens;
        }

        return context.trim();
    }

    async searchByType(type: 'profile' | 'project' | 'experience' | 'education' | 'skills', query?: string): Promise<any[]> {
        const filter = { type };
        const searchQuery = query || `information about ${type}`;
        return this.search(searchQuery, 5, filter);
    }

    async searchByTechnology(technology: string): Promise<any[]> {
        const results = await this.search(technology, 10);

        // Filter results that actually contain the technology
        return results.filter(result =>
            result.content.toLowerCase().includes(technology.toLowerCase()) ||
            result.metadata.technologies?.some((tech: string) =>
                tech.toLowerCase().includes(technology.toLowerCase())
            )
        );
    }
}

// ✅ Hack pour garantir une seule instance dans Next.js
const globalForRag = globalThis as unknown as { ragSystem?: RAGSystem };

export const ragSystem = globalForRag.ragSystem ?? new RAGSystem();
if (!globalForRag.ragSystem) {
    globalForRag.ragSystem = ragSystem;
}
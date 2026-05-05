import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { githubSyncService } from '../../services/github-sync';

// Tool for getting Ethan's profile information
export class GetProfileTool extends StructuredTool {
    name = 'get_profile';
    description = 'Get Ethan\'s basic profile information including name, age, location, and bio';
    schema = z.object({
        include_contact: z.boolean().optional().describe('Whether to include contact information')
    });

    async _call(input: z.infer<typeof this.schema>) {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();

            const profile = {
                name: syncedData.personal.name,
                age: syncedData.personal.age,
                location: syncedData.personal.location,
                bio: syncedData.personal.bio,
                languages: syncedData.personal.languages,
                ...(input.include_contact && {
                    github: syncedData.social.github,
                    linkedin: syncedData.social.linkedin,
                    portfolio: syncedData.social.portfolio
                })
            };

            return JSON.stringify(profile, null, 2);
        } catch (error) {
            return `Error retrieving profile: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Tool for searching projects
export class SearchProjectsTool extends StructuredTool {
    name = 'search_projects';
    description = 'Search for projects by name, description, or technologies used';
    schema = z.object({
        query: z.string().describe('Search term to find projects'),
        limit: z.number().optional().default(5).describe('Maximum number of projects to return'),
        featured_only: z.boolean().optional().describe('Only return featured projects')
    });

    async _call(input: z.infer<typeof this.schema>) {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();

            let projects = syncedData.projects;

            // Filter by featured if requested
            if (input.featured_only) {
                projects = projects.filter(project => project.featured);
            }

            // Search in name, description, and technologies
            const searchTerm = input.query.toLowerCase();
            const filteredProjects = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
            );

            // Limit results
            const limitedProjects = filteredProjects.slice(0, input.limit);

            return JSON.stringify(limitedProjects, null, 2);
        } catch (error) {
            return `Error searching projects: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Tool for getting skills by category
export class GetSkillsTool extends StructuredTool {
    name = 'get_skills';
    description = 'Get Ethan\'s skills organized by category (programming, frameworks, databases, tools, soft skills)';
    schema = z.object({
        category: z.enum(['programming', 'frameworks', 'databases', 'tools', 'soft_skills', 'all']).optional().describe('Specific skill category to retrieve')
    });

    async _call(input: z.infer<typeof this.schema>) {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();

            if (input.category && input.category !== 'all') {
                return JSON.stringify({
                    category: input.category,
                    skills: syncedData.skills[input.category] || []
                }, null, 2);
            }

            return JSON.stringify(syncedData.skills, null, 2);
        } catch (error) {
            return `Error retrieving skills: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Tool for getting experience information
export class GetExperienceTool extends StructuredTool {
    name = 'get_experience';
    description = 'Get Ethan\'s work experience including current and previous positions';
    schema = z.object({
        include_current: z.boolean().optional().default(true).describe('Include current position'),
        include_previous: z.boolean().optional().default(true).describe('Include previous positions'),
        limit: z.number().optional().describe('Maximum number of experiences to return')
    });

    async _call(input: z.infer<typeof this.schema>) {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();

            const experience = {
                current: input.include_current ? syncedData.experience.current : null,
                previous: input.include_previous ? syncedData.experience.previous : []
            };

            if (input.limit && experience.previous) {
                experience.previous = experience.previous.slice(0, input.limit);
            }

            return JSON.stringify(experience, null, 2);
        } catch (error) {
            return `Error retrieving experience: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Tool for getting education information
export class GetEducationTool extends StructuredTool {
    name = 'get_education';
    description = 'Get Ethan\'s educational background and qualifications';
    schema = z.object({});

    async _call() {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();
            return JSON.stringify(syncedData.education, null, 2);
        } catch (error) {
            return `Error retrieving education: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Tool for getting quick facts
export class GetQuickFactsTool extends StructuredTool {
    name = 'get_quick_facts';
    description = 'Get quick facts and statistics about Ethan';
    schema = z.object({});

    async _call() {
        try {
            const syncedData = await githubSyncService.syncWithPersonalData();

            const facts = {
                name: syncedData.personal.name,
                age: syncedData.personal.age,
                programming_languages: syncedData.skills.programming.length,
                total_projects: syncedData.projects.length,
                featured_projects: syncedData.projects.filter(p => p.featured).length,
                total_experience: syncedData.experience.previous.length + 1,
                location: syncedData.personal.location
            };

            return JSON.stringify(facts, null, 2);
        } catch (error) {
            return `Error retrieving quick facts: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Export all tools
export const mcpTools = [
    new GetProfileTool(),
    new SearchProjectsTool(),
    new GetSkillsTool(),
    new GetExperienceTool(),
    new GetEducationTool(),
    new GetQuickFactsTool()
];


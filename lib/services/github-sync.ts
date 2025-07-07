import { personalData, PersonalData } from '../data/personal-data';

export interface GitHubProject {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language?: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export class GitHubSyncService {
  private static instance: GitHubSyncService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): GitHubSyncService {
    if (!GitHubSyncService.instance) {
      GitHubSyncService.instance = new GitHubSyncService();
    }
    return GitHubSyncService.instance;
  }

  async fetchGitHubProjects(username: string): Promise<GitHubProject[]> {
    const cacheKey = `github_projects_${username}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      if (!response.ok) throw new Error('Failed to fetch GitHub projects');
      
      const projects: GitHubProject[] = await response.json();
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: projects,
        timestamp: Date.now()
      });
      
      return projects;
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return [];
    }
  }

  async syncWithPersonalData(): Promise<PersonalData> {
    const username = personalData.social.github.split('/').pop();
    if (!username) return personalData;

    const githubProjects = await this.fetchGitHubProjects(username);
    
    // Mettre à jour les projets avec les données GitHub
    const updatedProjects = personalData.projects.map(project => {
      const githubProject = githubProjects.find(gp => 
        gp.name.toLowerCase() === project.name.toLowerCase() ||
        gp.html_url === project.githubUrl
      );
      
      if (githubProject) {
        return {
          ...project,
          description: githubProject.description || project.description,
          technologies: Array.from(new Set([...project.technologies, githubProject.language].filter(Boolean))),
          githubUrl: githubProject.html_url,
        };
      }
      
      return project;
    });

    // Add new GitHub projects
    const existingProjectNames = personalData.projects.map(p => p.name.toLowerCase());
    const newProjects = githubProjects
      .filter(gp => !existingProjectNames.includes(gp.name.toLowerCase()))
      .map(gp => ({
        id: gp.name,
        name: gp.name,
        description: gp.description || 'GitHub Project',
        technologies: [gp.language].filter(Boolean),
        githubUrl: gp.html_url,
        liveUrl: gp.homepage,
        featured: gp.stargazers_count > 5,
      }));

    return {
      ...personalData,
      projects: [...updatedProjects, ...newProjects],
    };
  }

  async getSkillsFromGitHub(): Promise<string[]> {
    const username = personalData.social.github.split('/').pop();
    if (!username) return [];

    const projects = await this.fetchGitHubProjects(username);
    const languages = new Set<string>();
    
    projects.forEach(project => {
      if (project.language) {
        languages.add(project.language);
      }
    });

    return Array.from(languages);
  }
}

export const githubSyncService = GitHubSyncService.getInstance(); 
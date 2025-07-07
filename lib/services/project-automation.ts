import { githubSyncService, GitHubProject } from './github-sync';
import { personalData, PersonalData } from '../data/personal-data';

export interface AutomatedProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  stars: number;
  forks: number;
  lastUpdated: string;
  topics: string[];
}

export class ProjectAutomationService {
  private static instance: ProjectAutomationService;

  static getInstance(): ProjectAutomationService {
    if (!ProjectAutomationService.instance) {
      ProjectAutomationService.instance = new ProjectAutomationService();
    }
    return ProjectAutomationService.instance;
  }

  async getAutomatedProjects(): Promise<AutomatedProject[]> {
    const username = personalData.social.github.split('/').pop();
    if (!username) return [];

    try {
      const githubProjects = await githubSyncService.fetchGitHubProjects(username);
      
      return githubProjects.map(project => ({
        id: project.name,
        name: project.name,
        description: project.description || 'GitHub Project',
        technologies: [project.language].filter(Boolean),
        githubUrl: project.html_url,
        liveUrl: project.homepage,
        featured: project.stargazers_count > 5 || project.forks_count > 2,
        stars: project.stargazers_count,
        forks: project.forks_count,
        lastUpdated: project.updated_at,
        topics: project.topics || [],
      }));
    } catch (error) {
      console.error('Error fetching automated projects:', error);
      return [];
    }
  }

  async getFeaturedProjects(): Promise<AutomatedProject[]> {
    const projects = await this.getAutomatedProjects();
    return projects.filter(project => project.featured);
  }

  async getProjectsByTechnology(technology: string): Promise<AutomatedProject[]> {
    const projects = await this.getAutomatedProjects();
    const tech = technology.toLowerCase();
    
    return projects.filter(project =>
      project.technologies.some(t => t.toLowerCase().includes(tech)) ||
      project.topics.some(topic => topic.toLowerCase().includes(tech))
    );
  }

  async getRecentProjects(limit: number = 5): Promise<AutomatedProject[]> {
    const projects = await this.getAutomatedProjects();
    return projects
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit);
  }

  async getProjectStats(): Promise<{
    totalProjects: number;
    totalStars: number;
    totalForks: number;
    topTechnologies: string[];
  }> {
    const projects = await this.getAutomatedProjects();
    
    const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);
    const totalForks = projects.reduce((sum, p) => sum + p.forks, 0);
    
    // Get top technologies
    const techCount: Record<string, number> = {};
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });
    
    const topTechnologies = Object.entries(techCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tech]) => tech);

    return {
      totalProjects: projects.length,
      totalStars,
      totalForks,
      topTechnologies,
    };
  }

  async syncWithPersonalData(): Promise<PersonalData> {
    const automatedProjects = await this.getAutomatedProjects();
    
    // Convert automated projects to personal data format
    const projects = automatedProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      featured: project.featured,
    }));

    return {
      ...personalData,
      projects,
    };
  }
}

export const projectAutomationService = ProjectAutomationService.getInstance(); 
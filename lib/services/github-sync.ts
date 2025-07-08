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

export interface GitHubSkill {
  name: string;
  category: 'programming' | 'framework' | 'tool' | 'database' | 'platform';
  frequency: number;
  projects: string[];
  stars: number;
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
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Ethan-Portfolio-App'
      };

      // Ajouter le token d'authentification si disponible
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('GitHub token invalide ou manquant. Utilisation des données publiques uniquement.');
        } else if (response.status === 403) {
          console.warn('Limite de taux GitHub atteinte. Utilisation des données publiques uniquement.');
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        return [];
      }
      
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

  async extractSkillsFromGitHub(): Promise<GitHubSkill[]> {
    const username = personalData.social.github.split('/').pop();
    if (!username) return [];

    const projects = await this.fetchGitHubProjects(username);
    const skillMap = new Map<string, GitHubSkill>();

    // Define skill categories
    const skillCategories = {
      programming: ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'c++', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
      framework: ['react', 'vue', 'angular', 'next.js', 'nuxt', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'pytorch', 'tensorflow', 'langchain', 'transformers'],
      tool: ['git', 'docker', 'kubernetes', 'jenkins', 'github', 'gitlab', 'bitbucket', 'vscode', 'cursor', 'postman', 'figma'],
      database: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'elasticsearch', 'cassandra'],
      platform: ['aws', 'azure', 'gcp', 'vercel', 'netlify', 'heroku', 'digitalocean']
    };

    projects.forEach(project => {
      // Extract from language
      if (project.language) {
        const language = project.language.toLowerCase();
        this.addSkillToMap(skillMap, language, 'programming', project);
      }

      // Extract from topics
      project.topics.forEach(topic => {
        const topicLower = topic.toLowerCase();
        
        // Check each category
        Object.entries(skillCategories).forEach(([category, skills]) => {
          if (skills.some(skill => topicLower.includes(skill))) {
            this.addSkillToMap(skillMap, topic, category as any, project);
          }
        });
      });

      // Extract from description
      if (project.description) {
        const descLower = project.description.toLowerCase();
        Object.entries(skillCategories).forEach(([category, skills]) => {
          skills.forEach(skill => {
            if (descLower.includes(skill)) {
              this.addSkillToMap(skillMap, skill, category as any, project);
            }
          });
        });
      }
    });

    return Array.from(skillMap.values()).sort((a, b) => b.frequency - a.frequency);
  }

  private addSkillToMap(skillMap: Map<string, GitHubSkill>, skillName: string, category: string, project: GitHubProject) {
    const normalizedName = skillName.toLowerCase();
    const existing = skillMap.get(normalizedName);
    
    if (existing) {
      existing.frequency++;
      existing.stars += project.stargazers_count;
      if (!existing.projects.includes(project.name)) {
        existing.projects.push(project.name);
      }
    } else {
      skillMap.set(normalizedName, {
        name: skillName,
        category: category as any,
        frequency: 1,
        projects: [project.name],
        stars: project.stargazers_count
      });
    }
  }

  async getSkillsByCategory(): Promise<Record<string, GitHubSkill[]>> {
    const skills = await this.extractSkillsFromGitHub();
    
    const skillsByCategory = {
      programming: skills.filter(s => s.category === 'programming'),
      framework: skills.filter(s => s.category === 'framework'),
      tool: skills.filter(s => s.category === 'tool'),
      database: skills.filter(s => s.category === 'database'),
      platform: skills.filter(s => s.category === 'platform')
    };

    return skillsByCategory;
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

    // Ajouter les nouveaux projets GitHub
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
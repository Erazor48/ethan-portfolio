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

// Nouveau mapping éditable et patterns pour la catégorisation
export const skillCategoryMapping: Record<string, string> = {
  // Programming
  python: 'programming',
  javascript: 'programming',
  typescript: 'programming',
  java: 'programming',
  c: 'programming',
  cpp: 'programming',
  'c++': 'programming',
  go: 'programming',
  rust: 'programming',
  php: 'programming',
  ruby: 'programming',
  swift: 'programming',
  kotlin: 'programming',
  'batch-file': 'programming',

  // Frameworks
  react: 'framework',
  vue: 'framework',
  angular: 'framework',
  'next.js': 'framework',
  nextjs: 'framework',
  nuxt: 'framework',
  express: 'framework',
  django: 'framework',
  flask: 'framework',
  fastapi: 'framework',
  spring: 'framework',
  laravel: 'framework',
  rails: 'framework',
  pytorch: 'framework',
  tensorflow: 'framework',
  langchain: 'framework',
  transformers: 'framework',
  gradio: 'framework',
  pygame: 'framework',
  tkinter: 'framework',
  'tailwind-css': 'framework',

  // Tools
  git: 'tool',
  docker: 'tool',
  kubernetes: 'tool',
  jenkins: 'tool',
  github: 'tool',
  gitlab: 'tool',
  bitbucket: 'tool',
  vscode: 'tool',
  cursor: 'tool',
  postman: 'tool',
  figma: 'tool',
  giskard: 'tool',
  'llm-security': 'tool',
  'prompt-injection': 'tool',

  // Databases
  mysql: 'database',
  postgresql: 'database',
  mongodb: 'database',
  redis: 'database',
  sqlite: 'database',
  elasticsearch: 'database',
  cassandra: 'database',
  sqlalchemy: 'database',

  // Platforms
  aws: 'platform',
  azure: 'platform',
  gcp: 'platform',
  vercel: 'platform',
  netlify: 'platform',
  heroku: 'platform',
  digitalocean: 'platform',
  youtube: 'platform',

  // Other / Concepts / Soft Skills
  bilingual: 'other',
  'video-extraction': 'other',
  'web-application': 'other',
  'music-player': 'other',
  'ai-safety': 'other'
};

export function categorizeSkill(skill: string): string {
  const s = skill.toLowerCase();
  if (skillCategoryMapping[s]) return skillCategoryMapping[s];

  // Fallback : règles dynamiques
  if (s.includes('js') || s.includes('react') || s.includes('vue') || s.includes('angular')) return 'framework';
  if (s.includes('python') || s.includes('typescript') || s.includes('java') || s.includes('c++')) return 'programming';
  if (s.includes('docker') || s.includes('github') || s.includes('vercel') || s.includes('tool')) return 'tool';
  if (s.includes('sql') || s.includes('mongo') || s.includes('db')) return 'database';
  if (s.includes('aws') || s.includes('azure') || s.includes('gcp') || s.includes('platform')) return 'platform';

  return 'other';
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
        'Accept': 'application/vnd.github.mercy-preview+json',
        'User-Agent': 'Ethan-Portfolio-App'
      };

      // Ajouter le token d'authentification si disponible
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      // 1. Récupérer la liste des repos
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

      // 2. Pour chaque repo, enrichir avec les topics via /repos/:owner/:repo
      const enrichedProjects = await Promise.all(projects.map(async (project) => {
        try {
          const repoResp = await fetch(`https://api.github.com/repos/${username}/${project.name}`, { headers });
          if (repoResp.ok) {
            const repoData = await repoResp.json();
            return { ...project, topics: repoData.topics || [] };
          }
        } catch (err) {
          // ignore, fallback to original project
        }
        return { ...project, topics: project.topics || [] };
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        data: enrichedProjects,
        timestamp: Date.now()
      });
      
      return enrichedProjects;
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

    projects.forEach(project => {
      // Main Language
      if (project.language) {
        //const cat = categorizeSkill(project.language); It's not necessary to use categorizeSkill. All are programming.
        const cat = 'programming';
        this.addSkillToMap(skillMap, project.language, cat, project);
      }
      // Topics
      project.topics.forEach(topic => {
        const cat = categorizeSkill(topic);
        this.addSkillToMap(skillMap, topic, cat, project);
      });
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
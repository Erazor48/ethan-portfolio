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
  // Last good result per username, kept even when expired so we can serve it
  // if GitHub rate-limits us (60 req/h per IP without a token).
  private cache: Map<string, { data: GitHubProject[]; timestamp: number }> = new Map();
  // Coalesces concurrent calls: one request can trigger several syncs.
  private inflight: Map<string, Promise<GitHubProject[]>> = new Map();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour

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

    const pending = this.inflight.get(cacheKey);
    if (pending) return pending;

    const request = this.loadGitHubProjects(username, cacheKey, cached?.data).finally(() => {
      this.inflight.delete(cacheKey);
    });
    this.inflight.set(cacheKey, request);
    return request;
  }

  private async loadGitHubProjects(
    username: string,
    cacheKey: string,
    stale: GitHubProject[] | undefined
  ): Promise<GitHubProject[]> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Ethan-Portfolio-App'
      };

      // Optional token: raises the limit from 60 to 5000 requests/hour.
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
      }

      // One single request. The repository list already includes `topics`,
      // so no per-repo call is needed (it used to cost 1 + N requests).
      // `revalidate` lets Next.js share the response across serverless instances.
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`,
        { headers, next: { revalidate: 3600 } }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('GitHub token invalide. Utilisation des dernières données connues.');
        } else if (response.status === 403 || response.status === 429) {
          console.warn('Limite de taux GitHub atteinte. Utilisation des dernières données connues.');
        } else {
          console.warn(`GitHub API error: ${response.status}. Utilisation des dernières données connues.`);
        }
        return stale ?? [];
      }

      const repos: GitHubProject[] = await response.json();
      const projects = repos
        .filter((repo: any) => !repo.fork && !repo.archived)
        .map((repo) => ({ ...repo, topics: repo.topics || [] }));

      this.cache.set(cacheKey, { data: projects, timestamp: Date.now() });
      return projects;
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return stale ?? [];
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
        gp.name.toLowerCase() === project.id.toLowerCase() ||
        gp.html_url.toLowerCase() === (project.githubUrl || '').toLowerCase()
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
    // A repo is already listed if its name, the project id or the GitHub URL matches
    // (display names such as "Music Player" differ from the repo name "Music_Player").
    const existingKeys = new Set<string>();
    personalData.projects.forEach(p => {
      existingKeys.add(p.name.toLowerCase());
      existingKeys.add(p.id.toLowerCase());
      if (p.githubUrl) existingKeys.add(p.githubUrl.toLowerCase());
    });
    const newProjects = githubProjects
      .filter(gp => !existingKeys.has(gp.name.toLowerCase()) && !existingKeys.has(gp.html_url.toLowerCase()))
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
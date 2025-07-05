import { Tool } from './index';

export class GitHubTool implements Tool {
  name = 'get_github_profile';
  description = 'Get Ethan\'s GitHub profile information, repositories, and contributions';
  parameters = {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['profile', 'repos', 'contributions', 'stats']
      }
    }
  };

  async execute(params: any): Promise<any> {
    const { action = 'profile' } = params;
    
    try {
      // GitHub API endpoint
      const username = 'Erazor48';
      const baseUrl = 'https://api.github.com';
      
      switch (action) {
        case 'profile':
          return await this.getProfile(username, baseUrl);
        case 'repos':
          return await this.getRepositories(username, baseUrl);
        case 'contributions':
          return await this.getContributions(username);
        case 'stats':
          return await this.getStats(username, baseUrl);
        default:
          return await this.getProfile(username, baseUrl);
      }
    } catch (error) {
      console.error('GitHub tool error:', error);
      return {
        error: 'Failed to fetch GitHub data',
        fallback: this.getFallbackData()
      };
    }
  }

  private async getProfile(username: string, baseUrl: string) {
    const response = await fetch(`${baseUrl}/users/${username}`);
    const data = await response.json();
    
    return {
      username: data.login,
      name: data.name,
      bio: data.bio,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      avatar_url: data.avatar_url,
      html_url: data.html_url
    };
  }

  private async getRepositories(username: string, baseUrl: string) {
    const response = await fetch(`${baseUrl}/users/${username}/repos?sort=updated&per_page=10`);
    const repos = await response.json();
    
    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      is_fork: repo.fork
    }));
  }

  private async getContributions(username: string) {
    // Note: GitHub doesn't provide public API for contribution graph
    // This would require scraping or using GitHub's GraphQL API
    return {
      message: 'Contribution data requires GitHub GraphQL API access',
      username: username,
      profile_url: `https://github.com/${username}`
    };
  }

  private async getStats(username: string, baseUrl: string) {
    const [profile, repos] = await Promise.all([
      this.getProfile(username, baseUrl),
      this.getRepositories(username, baseUrl)
    ]);
    
    const languages = repos.reduce((acc: any, repo: any) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});
    
    return {
      total_repos: repos.length,
      total_stars: repos.reduce((sum: number, repo: any) => sum + repo.stars, 0),
      total_forks: repos.reduce((sum: number, repo: any) => sum + repo.forks, 0),
      top_languages: Object.entries(languages)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => ({ language: lang, count }))
    };
  }

  private getFallbackData() {
    return {
      username: 'Erazor48',
      name: 'Ethan Orain',
      bio: 'Full Stack Developer passionate about modern web technologies',
      public_repos: 'Multiple repositories',
      followers: 'Growing community',
      profile_url: 'https://github.com/Erazor48',
      top_repos: [
        'portfolio-website',
        'ecommerce-platform', 
        'task-management-app'
      ]
    };
  }
} 
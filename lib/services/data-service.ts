import { personalData, PersonalData } from '../data/personal-data';
import { githubSyncService } from './github-sync';

export class DataService {
  private static instance: DataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached && Date.now() - cached.timestamp < this.cacheExpiry;
  }

  async getPersonalData(): Promise<PersonalData> {
    const cacheKey = 'personal_data';
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }
    // Synchronisation GitHub uniquement pour les projets
    const syncedData = await githubSyncService.syncWithPersonalData();
    this.cache.set(cacheKey, {
      data: syncedData,
      timestamp: Date.now()
    });
    return syncedData;
  }

  async getProjects() {
    const data = await this.getPersonalData();
    return data.projects;
  }

  async getSkills() {
    const data = await this.getPersonalData();
    return data.skills;
  }

  async getExperience() {
    const data = await this.getPersonalData();
    return data.experience;
  }

  async getPersonalInfo() {
    const data = await this.getPersonalData();
    return data.personal;
  }

  async getEducation() {
    const data = await this.getPersonalData();
    return data.education;
  }

  async getSocialLinks() {
    const data = await this.getPersonalData();
    return data.social;
  }

  async searchProjects(query: string) {
    const projects = await this.getProjects();
    const searchTerm = query.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }

  async getFeaturedProjects() {
    const projects = await this.getProjects();
    return projects.filter(project => project.featured);
  }

  async getSkillsByCategory() {
    const skills = await this.getSkills();
    return skills;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const dataService = DataService.getInstance(); 
import { personalData } from '../data/personal-data';

export interface LinkedInProfile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  experience: LinkedInExperience[];
  education: LinkedInEducation[];
  skills: LinkedInSkill[];
}

export interface LinkedInExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  location?: string;
}

export interface LinkedInEducation {
  degree: string;
  institution: string;
  duration: string;
  description?: string;
}

export interface LinkedInSkill {
  name: string;
  endorsements: number;
  category: 'technical' | 'soft' | 'language' | 'tool';
}

export class LinkedInSyncService {
  private static instance: LinkedInSyncService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes

  static getInstance(): LinkedInSyncService {
    if (!LinkedInSyncService.instance) {
      LinkedInSyncService.instance = new LinkedInSyncService();
    }
    return LinkedInSyncService.instance;
  }

  async fetchLinkedInProfile(): Promise<LinkedInProfile | null> {
    // Note: LinkedIn API requires authentication and is complex to set up
    // For now, we'll return null to trigger fallback to local data
    // In production, you'd need to use LinkedIn API with proper authentication
    
    try {
      // Attempt to fetch from LinkedIn API (would need proper setup)
      // const response = await fetch('https://api.linkedin.com/v2/me', {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // For now, return null to use fallback data
      return null;
    } catch (error) {
      console.error('LinkedIn API not configured, using fallback data');
      return null;
    }
  }

  async getSkillsByCategory(): Promise<Record<string, LinkedInSkill[]>> {
    const profile = await this.fetchLinkedInProfile();
    if (!profile) {
      // Return empty to trigger GitHub fallback
      return {};
    }

    const skillsByCategory = {
      technical: profile.skills.filter(s => s.category === 'technical'),
      tools: profile.skills.filter(s => s.category === 'tool'),
      soft: profile.skills.filter(s => s.category === 'soft'),
      languages: profile.skills.filter(s => s.category === 'language')
    };

    return skillsByCategory;
  }

  async getTopSkills(limit: number = 10): Promise<LinkedInSkill[]> {
    const profile = await this.fetchLinkedInProfile();
    if (!profile) return [];

    return profile.skills
      .sort((a, b) => b.endorsements - a.endorsements)
      .slice(0, limit);
  }

  async getExperience(): Promise<LinkedInExperience[]> {
    const profile = await this.fetchLinkedInProfile();
    return profile?.experience || [];
  }

  async getEducation(): Promise<LinkedInEducation[]> {
    const profile = await this.fetchLinkedInProfile();
    return profile?.education || [];
  }
}

export const linkedinSyncService = LinkedInSyncService.getInstance(); 
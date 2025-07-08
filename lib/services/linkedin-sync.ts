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
    try {
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

      if (!accessToken) {
        console.warn('LinkedIn access token manquant. Utilisation des données locales.');
        return null;
      }

      // Fetch basic profile information
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!profileResponse.ok) {
        console.warn(`LinkedIn API error: ${profileResponse.status}. Utilisation des données locales.`);
        return null;
      }

      const profile = await profileResponse.json();

      // Fetch experience
      const experienceResponse = await fetch('https://api.linkedin.com/v2/me/positions', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let experience: LinkedInExperience[] = [];
      if (experienceResponse.ok) {
        const experienceData = await experienceResponse.json();
        experience = experienceData.elements?.map((exp: any) => ({
          title: exp.title,
          company: exp.companyName,
          duration: `${exp.startDate?.year || 'N/A'} - ${exp.endDate?.year || 'Present'}`,
          description: exp.summary || '',
          location: exp.locationName
        })) || [];
      }

      // Fetch education
      const educationResponse = await fetch('https://api.linkedin.com/v2/me/educations', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let education: LinkedInEducation[] = [];
      if (educationResponse.ok) {
        const educationData = await educationResponse.json();
        education = educationData.elements?.map((edu: any) => ({
          degree: edu.degreeName || edu.fieldOfStudy,
          institution: edu.schoolName,
          duration: `${edu.startDate?.year || 'N/A'} - ${edu.endDate?.year || 'Present'}`,
          description: edu.activities || ''
        })) || [];
      }

      // Fetch skills
      const skillsResponse = await fetch('https://api.linkedin.com/v2/me/skills', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let skills: LinkedInSkill[] = [];
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        skills = skillsData.elements?.map((skill: any) => ({
          name: skill.skillName,
          endorsements: skill.numEndorsements || 0,
          category: this.categorizeSkill(skill.skillName)
        })) || [];
      }

      return {
        name: profile.localizedFirstName + ' ' + profile.localizedLastName,
        headline: profile.headline || '',
        location: profile.location?.name || '',
        summary: profile.summary || '',
        experience,
        education,
        skills
      };

    } catch (error) {
      console.error('LinkedIn API error:', error);
      return null;
    }
  }

  private categorizeSkill(skillName: string): 'technical' | 'soft' | 'language' | 'tool' {
    const technicalSkills = ['python', 'javascript', 'react', 'node.js', 'java', 'c++', 'sql', 'git'];
    const toolSkills = ['docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'jira'];
    const languageSkills = ['french', 'english', 'spanish', 'german'];
    
    const skillLower = skillName.toLowerCase();
    
    if (technicalSkills.some(tech => skillLower.includes(tech))) return 'technical';
    if (toolSkills.some(tool => skillLower.includes(tool))) return 'tool';
    if (languageSkills.some(lang => skillLower.includes(lang))) return 'language';
    
    return 'soft';
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
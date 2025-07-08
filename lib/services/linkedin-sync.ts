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
    // Note: LinkedIn API requires authentication
    // For now, we'll use mock data based on your profile
    // In production, you'd need to use LinkedIn API with proper authentication
    
    const mockProfile: LinkedInProfile = {
      name: "Ethan Orain",
      headline: "AI Engineer · NLP · Neural Networks · LLMs Enthusiast",
      location: "France",
      summary: "I'm an Artificial Intelligence student at Aivancity, passionate about natural language processing, neural networks and intelligent agent design. My goal: to create useful, elegant and powerful systems that can understand, learn and interact.",
      experience: [
        {
          title: "AI Student",
          company: "Aivancity",
          duration: "2023 - Present",
          description: "Studying Artificial Intelligence with focus on NLP, neural networks and intelligent agent design"
        },
        {
          title: "AI Developer",
          company: "Freelance",
          duration: "2022 - 2023",
          description: "Working on various AI projects including NLP and computer vision"
        }
      ],
      education: [
        {
          degree: "Master in Artificial Intelligence",
          institution: "Aivancity",
          duration: "2023 - Present",
          description: "Specialization in natural language processing, neural networks and intelligent agent design"
        }
      ],
      skills: [
        // Technical Skills
        { name: "Python", endorsements: 15, category: "technical" },
        { name: "PyTorch", endorsements: 12, category: "technical" },
        { name: "LangChain", endorsements: 10, category: "technical" },
        { name: "Transformers", endorsements: 8, category: "technical" },
        { name: "React", endorsements: 6, category: "technical" },
        { name: "Next.js", endorsements: 5, category: "technical" },
        { name: "TypeScript", endorsements: 4, category: "technical" },
        { name: "C", endorsements: 3, category: "technical" },
        
        // Tools
        { name: "Git", endorsements: 12, category: "tool" },
        { name: "VS Code", endorsements: 10, category: "tool" },
        { name: "Cursor", endorsements: 8, category: "tool" },
        { name: "Docker", endorsements: 5, category: "tool" },
        
        // Soft Skills
        { name: "Problem Solving", endorsements: 15, category: "soft" },
        { name: "Communication", endorsements: 12, category: "soft" },
        { name: "Team Work", endorsements: 10, category: "soft" },
        { name: "Adaptability", endorsements: 8, category: "soft" },
        
        // Languages
        { name: "French", endorsements: 20, category: "language" },
        { name: "English", endorsements: 15, category: "language" }
      ]
    };

    return mockProfile;
  }

  async getSkillsByCategory(): Promise<Record<string, LinkedInSkill[]>> {
    const profile = await this.fetchLinkedInProfile();
    if (!profile) return {};

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
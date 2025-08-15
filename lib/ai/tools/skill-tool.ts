import { Tool } from './index';

export class SkillTool implements Tool {
  name = 'get_skills';
  description = 'Get Ethan\'s technical skills, experience levels, and expertise areas';
  parameters = {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['all', 'frontend', 'backend', 'databases', 'devops', 'ai_ml']
      },
      level: {
        type: 'string',
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      }
    }
  };

  async execute(params: any): Promise<any> {
    const { category = 'all', level } = params;
    
    try {
      const skills = await this.getSkills();
      
      let filteredSkills = skills;
      
      if (category !== 'all') {
        filteredSkills = skills.filter(skill => skill.category === category);
      }
      
      if (level) {
        filteredSkills = filteredSkills.filter(skill => skill.level === level);
      }
      
      return {
        skills: filteredSkills,
        summary: this.generateSummary(filteredSkills),
        categories: this.getCategories(skills),
        total_skills: skills.length
      };
    } catch (error) {
      console.error('Skill tool error:', error);
      return this.getFallbackSkills();
    }
  }

  private async getSkills() {
    return [
      // Frontend
      {
        name: 'React',
        category: 'frontend',
        level: 'advanced',
        experience_years: 2,
        description: 'Modern React with hooks, context, and performance optimization',
        projects_count: 8,
        last_used: '2024-01-20'
      },
      {
        name: 'Next.js',
        category: 'frontend',
        level: 'advanced',
        experience_years: 1.5,
        description: 'Full-stack React framework with SSR, SSG, and API routes',
        projects_count: 5,
        last_used: '2024-01-20'
      },
      {
        name: 'TypeScript',
        category: 'frontend',
        level: 'advanced',
        experience_years: 1.5,
        description: 'Type-safe JavaScript with advanced type features',
        projects_count: 6,
        last_used: '2024-01-20'
      },
      {
        name: 'Tailwind CSS',
        category: 'frontend',
        level: 'advanced',
        experience_years: 1.5,
        description: 'Utility-first CSS framework with custom configurations',
        projects_count: 7,
        last_used: '2024-01-20'
      },
      {
        name: 'JavaScript',
        category: 'frontend',
        level: 'expert',
        experience_years: 3,
        description: 'ES6+, async/await, modules, and modern patterns',
        projects_count: 15,
        last_used: '2024-01-20'
      },
      
      // Backend
      {
        name: 'Node.js',
        category: 'backend',
        level: 'advanced',
        experience_years: 2,
        description: 'Server-side JavaScript with Express and REST APIs',
        projects_count: 6,
        last_used: '2024-01-15'
      },
      {
        name: 'Python',
        category: 'backend',
        level: 'intermediate',
        experience_years: 1,
        description: 'Django, FastAPI, and data processing',
        projects_count: 3,
        last_used: '2024-01-10'
      },
      {
        name: 'Django',
        category: 'backend',
        level: 'intermediate',
        experience_years: 1,
        description: 'Full-stack Python web framework',
        projects_count: 2,
        last_used: '2024-01-10'
      },
      {
        name: 'FastAPI',
        category: 'backend',
        level: 'intermediate',
        experience_years: 0.5,
        description: 'Modern Python API framework',
        projects_count: 1,
        last_used: '2024-01-05'
      },
      
      // Databases
      {
        name: 'MongoDB',
        category: 'databases',
        level: 'intermediate',
        experience_years: 1.5,
        description: 'NoSQL database with Mongoose ODM',
        projects_count: 4,
        last_used: '2024-01-15'
      },
      {
        name: 'PostgreSQL',
        category: 'databases',
        level: 'intermediate',
        experience_years: 1,
        description: 'Relational database with complex queries',
        projects_count: 3,
        last_used: '2024-01-10'
      },
      
      // DevOps & Tools
      {
        name: 'Git',
        category: 'devops',
        level: 'advanced',
        experience_years: 2.5,
        description: 'Version control with GitHub workflows',
        projects_count: 20,
        last_used: '2024-01-20'
      },
      {
        name: 'Docker',
        category: 'devops',
        level: 'intermediate',
        experience_years: 0.5,
        description: 'Containerization and deployment',
        projects_count: 2,
        last_used: '2024-01-15'
      },
      {
        name: 'AWS',
        category: 'devops',
        level: 'beginner',
        experience_years: 0.3,
        description: 'Cloud services and deployment',
        projects_count: 1,
        last_used: '2024-01-10'
      },
      
      // AI & ML
      {
        name: 'AI Integration',
        category: 'ai_ml',
        level: 'intermediate',
        experience_years: 0.5,
        description: 'Hugging Face, OpenAI, and chatbot development',
        projects_count: 2,
        last_used: '2024-01-20'
      },
      {
        name: 'MCP Architecture',
        category: 'ai_ml',
        level: 'intermediate',
        experience_years: 0.3,
        description: 'Model Context Protocol for AI tool integration',
        projects_count: 1,
        last_used: '2024-01-20'
      }
    ];
  }

  private generateSummary(skills: any[]) {
    const totalSkills = skills.length;
    const advancedSkills = skills.filter(s => s.level === 'advanced' || s.level === 'expert').length;
    const frontendSkills = skills.filter(s => s.category === 'frontend').length;
    const backendSkills = skills.filter(s => s.category === 'backend').length;
    
    return {
      total_skills: totalSkills,
      advanced_skills: advancedSkills,
      frontend_skills: frontendSkills,
      backend_skills: backendSkills,
      primary_focus: frontendSkills > backendSkills ? 'Frontend Development' : 'Full Stack Development'
    };
  }

  private getCategories(skills: any[]) {
    const categories = skills.reduce((acc: any, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
    
    return Object.keys(categories).map(category => ({
      name: category,
      count: categories[category].length,
      skills: categories[category]
    }));
  }

  private getFallbackSkills() {
    return {
      skills: [
        { name: 'React', level: 'advanced', category: 'frontend' },
        { name: 'Next.js', level: 'advanced', category: 'frontend' },
        { name: 'TypeScript', level: 'advanced', category: 'frontend' },
        { name: 'Node.js', level: 'advanced', category: 'backend' },
        { name: 'MongoDB', level: 'intermediate', category: 'databases' }
      ],
      summary: {
        total_skills: 5,
        primary_focus: 'Full Stack Development'
      }
    };
  }
} 
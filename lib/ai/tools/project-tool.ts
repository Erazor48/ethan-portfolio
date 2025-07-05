import { Tool } from './index';

export class ProjectTool implements Tool {
  name = 'get_projects';
  description = 'Get detailed information about Ethan\'s projects, including technologies, descriptions, and links';
  parameters = {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        enum: ['all', 'featured', 'recent', 'by_tech']
      },
      technology: {
        type: 'string',
        description: 'Filter projects by specific technology'
      }
    }
  };

  async execute(params: any): Promise<any> {
    const { filter = 'all', technology } = params;
    
    try {
      const projects = await this.getProjects();
      
      switch (filter) {
        case 'featured':
          return projects.filter(p => p.featured);
        case 'recent':
          return projects.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);
        case 'by_tech':
          if (technology) {
            return projects.filter(p => p.technologies.some((tech: string) => 
              tech.toLowerCase().includes(technology.toLowerCase())
            ));
          }
          return projects;
        default:
          return projects;
      }
    } catch (error) {
      console.error('Project tool error:', error);
      return this.getFallbackProjects();
    }
  }

  private async getProjects() {
    // This would ideally fetch from a database or CMS
    // For now, using structured data
    return [
      {
        id: 'portfolio',
        name: 'Portfolio Website',
        description: 'Modern portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features responsive design, dark mode, and interactive components including an AI chatbot.',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'AI Chatbot'],
        github: 'https://github.com/Erazor48/portfolio',
        live: 'https://ethan-orain.com',
        featured: true,
        updated_at: '2024-01-15',
        image: '/portfolio-preview.jpg',
        highlights: [
          'AI-powered chatbot with MCP architecture',
          'Responsive design with dark mode',
          'Modern tech stack with TypeScript',
          'Interactive components and animations'
        ]
      },
      {
        id: 'ecommerce',
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce platform with user authentication, product management, payment integration, and admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'],
        github: 'https://github.com/Erazor48/ecommerce',
        live: null,
        featured: true,
        updated_at: '2024-01-10',
        image: '/ecommerce-preview.jpg',
        highlights: [
          'Secure payment processing with Stripe',
          'User authentication and authorization',
          'Product catalog with search and filters',
          'Admin dashboard for inventory management'
        ]
      },
      {
        id: 'task-manager',
        name: 'Task Management App',
        description: 'Real-time task management application with drag-and-drop functionality, team collaboration features, and progress tracking.',
        technologies: ['React', 'Firebase', 'TypeScript', 'Tailwind CSS', 'Real-time'],
        github: 'https://github.com/Erazor48/task-manager',
        live: null,
        featured: false,
        updated_at: '2024-01-05',
        image: '/task-manager-preview.jpg',
        highlights: [
          'Real-time collaboration',
          'Drag-and-drop interface',
          'Progress tracking and analytics',
          'Team management features'
        ]
      },
      {
        id: 'ai-chatbot',
        name: 'AI Chatbot System',
        description: 'Intelligent chatbot system using MCP (Model Context Protocol) architecture with access to dynamic resources and tools.',
        technologies: ['Next.js', 'TypeScript', 'Hugging Face', 'MCP', 'AI'],
        github: 'https://github.com/Erazor48/ai-chatbot',
        live: null,
        featured: true,
        updated_at: '2024-01-20',
        image: '/chatbot-preview.jpg',
        highlights: [
          'MCP architecture for tool access',
          'Dynamic resource integration',
          'Intelligent response generation',
          'Secure API design'
        ]
      }
    ];
  }

  private getFallbackProjects() {
    return [
      {
        name: 'Portfolio Website',
        description: 'Modern portfolio built with Next.js and TypeScript',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        github: 'https://github.com/Erazor48/portfolio'
      },
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        github: 'https://github.com/Erazor48/ecommerce'
      }
    ];
  }
} 
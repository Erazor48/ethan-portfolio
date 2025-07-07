export interface PersonalData {
  // Informations personnelles
  personal: {
    name: string;
    age: number;
    location: string;
    email: string;
    phone?: string;
    bio: string;
    languages: string[];
  };
  
  // Compétences techniques
  skills: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    softSkills: string[];
  };
  
  // Expérience professionnelle
  experience: {
    current: {
      company: string;
      position: string;
      duration: string;
      description: string;
      technologies: string[];
    };
    previous: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
      technologies: string[];
    }>;
  };
  
  // Formation
  education: {
    degree: string;
    institution: string;
    year: string;
    description: string;
  };
  
  // Projets (sera synchronisé avec GitHub)
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    image?: string;
    featured: boolean;
  }>;
  
  // Liens sociaux
  social: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
}

export const personalData: PersonalData = {
  personal: {
    name: "Ethan Orain",
    age: 22,
    location: "France",
    email: "ethan.orain@example.com",
    bio: "AI Engineer · NLP · Neural Networks · LLMs Enthusiast",
    languages: ["French", "English"],
  },
  
  skills: {
    programming: ["Python", "C", "JavaScript", "TypeScript"],
    frameworks: ["PyTorch", "LangChain", "Transformers", "React", "Next.js"],
    databases: ["SQLAlchemy", "PostgreSQL", "MongoDB"],
    tools: ["Cursor", "VS Code", "GitHub", "Git", "Docker"],
    softSkills: ["Problem solving", "Communication", "Team work", "Adaptability"],
  },
  
  experience: {
    current: {
      company: "Aivancity",
      position: "AI Student",
      duration: "2023 - Present",
      description: "Studying Artificial Intelligence with focus on NLP, neural networks and intelligent agent design",
      technologies: ["Python", "PyTorch", "LangChain", "Transformers"],
    },
    previous: [
      {
        company: "Freelance",
        position: "AI Developer",
        duration: "2022 - 2023",
        description: "Working on various AI projects including NLP and computer vision",
        technologies: ["Python", "PyTorch", "OpenAI", "Gradio"],
      }
    ],
  },
  
  education: {
    degree: "Master in Artificial Intelligence",
    institution: "Aivancity",
    year: "2023 - Present",
    description: "Specialization in natural language processing, neural networks and intelligent agent design",
  },
  
  projects: [
    {
      id: "portfolio",
      name: "Personal Portfolio",
      description: "Modern portfolio with integrated AI chatbot",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "LangChain"],
      githubUrl: "https://github.com/ethan-orain/portfolio",
      liveUrl: "https://ethan-orain.vercel.app",
      featured: true,
    }
  ],
  
  social: {
    github: "https://github.com/Erazor48",
    linkedin: "https://www.linkedin.com/in/ethan-orain",
    portfolio: "https://ethan-orain.vercel.app",
  },
}; 
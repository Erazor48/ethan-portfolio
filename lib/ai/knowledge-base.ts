export interface EthanProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  languages: string[];
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  image?: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

export const ethanProfile: EthanProfile = {
  name: "Ethan Orain",
  title: "Full Stack Developer",
  location: "France",
  email: "ethan.orain@aivancity.education",
  github: "https://github.com/Erazor48",
  linkedin: "https://linkedin.com/in/ethan-orain",
  skills: [
    "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
    "Tailwind CSS", "CSS3", "HTML5", "Git", "GitHub",
    "REST APIs", "GraphQL", "PostgreSQL", "MongoDB",
    "Python", "Django", "FastAPI", "Docker", "AWS"
  ],
  experience: [
    {
      company: "Freelance Developer",
      position: "Full Stack Developer",
      duration: "2023 - Present",
      description: [
        "Developed modern web applications using React, Next.js, and TypeScript",
        "Built responsive and accessible user interfaces with Tailwind CSS",
        "Implemented REST APIs and GraphQL endpoints",
        "Collaborated with clients to deliver high-quality solutions"
      ],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"]
    },
    {
      company: "Personal Projects",
      position: "Full Stack Developer",
      duration: "2022 - Present",
      description: [
        "Created portfolio websites and personal projects",
        "Developed e-commerce platforms and web applications",
        "Implemented modern development practices and tools"
      ],
      technologies: ["React", "Next.js", "TypeScript", "Python", "Django"]
    }
  ],
  projects: [
    {
      name: "Portfolio Website",
      description: "Modern portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features responsive design, dark mode, and interactive components.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
      github: "https://github.com/ethanorain/portfolio",
      live: "https://ethan-orain.com"
    },
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce platform with user authentication, product management, and payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com/ethanorain/ecommerce"
    },
    {
      name: "Task Management App",
      description: "Real-time task management application with drag-and-drop functionality and team collaboration features.",
      technologies: ["React", "Firebase", "TypeScript", "Tailwind CSS"],
      github: "https://github.com/ethanorain/task-manager"
    }
  ],
  education: [
    {
      institution: "Self-Taught Developer",
      degree: "Full Stack Web Development",
      duration: "2022 - Present",
      description: "Learned modern web development through online courses, documentation, and hands-on projects."
    }
  ],
  languages: ["English", "French"]
};

export function getEthanContext(): string {
  return `
Ethan Orain is a passionate Full Stack Developer based in France. Here's what you need to know about him:

PROFILE:
- Name: Ethan Orain
- Title: Full Stack Developer
- Location: France
- Email: ethan.orain@aivancity.education
- GitHub: https://github.com/Erazor48
- LinkedIn: https://linkedin.com/in/ethan-orain

SKILLS:
${ethanProfile.skills.join(', ')}

EXPERIENCE:
${ethanProfile.experience.map(exp => 
  `- ${exp.position} at ${exp.company} (${exp.duration})
   Technologies: ${exp.technologies.join(', ')}
   ${exp.description.join(' ')}`
).join('\n')}

PROJECTS:
${ethanProfile.projects.map(project => 
  `- ${project.name}: ${project.description}
   Technologies: ${project.technologies.join(', ')}
   GitHub: ${project.github || 'Not available'}
   Live: ${project.live || 'Not available'}`
).join('\n')}

EDUCATION:
${ethanProfile.education.map(edu => 
  `- ${edu.degree} from ${edu.institution} (${edu.duration})
   ${edu.description}`
).join('\n')}

LANGUAGES: ${ethanProfile.languages.join(', ')}

IMPORTANT: Always respond in English. Be helpful, professional, and enthusiastic about Ethan's work. If someone asks about specific projects, skills, or experience, provide detailed information based on the data above. If you don't have information about something, politely say you don't have that information but can help with what you do know about Ethan.
`;
} 
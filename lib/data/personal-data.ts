export interface PersonalData {
  // Informations personnelles
  personal: {
    name: string;
    user_name: string,
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
      description: string;
      technologies: string[];
      start: { month: string; year: string };
      end: { month: string; year: string } | null;
      ongoing: boolean;
    };
    previous: Array<{
      company: string;
      position: string;
      description: string;
      technologies: string[];
      start: { month: string; year: string };
      end: { month: string; year: string } | null;
      ongoing: boolean;
    }>;
  };
  
  // Formation
  education: Array<{
    degree: string;
    program: string;
    field: string;
    institution: string;
    start: { month: string; year: string };
    end: { month: string; year: string } | null;
    description: string;
    technologies: string[];
    grade?: number | null;
  }>;
  
  // Projets (will be synchronyse with GitHub)
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    image?: string;
    featured: boolean;
    start?: { month: string; year: string } | null;
    end?: { month: string; year: string } | null;
    ongoing?: boolean;
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
    user_name: "Erazor_48",
    age: 21,
    location: "Paris, France",
    email: "ethan.orain@aivancity.education",
    bio: "AI Engineer · NLP · Neural Networks · LLMs Enthusiast",
    languages: ["French", "English"],
  },
  
  skills: {
    programming: ["Python", "C", "JavaScript", "TypeScript", "HTML", "CSS"],
    frameworks: ["PyTorch", "LangChain", "Transformers", "React", "Next.js"],
    databases: ["SQLAlchemy"],
    tools: ["Cursor", "VS Code", "GitHub", "Git"],
    softSkills: ["Critical Thinking", "Complex Problem Solving", "Analytical Thinking", 
      "Conceptual Thinking", "Intellectual Curiosity", "Independent Thinking", 
      "Logical Reasoning"
    ],
  },
  
  experience: {
    current: {
      company: "Aivancity",
      position: "AI Student",
      description: "I collect savings data from social networks to predict finance.",
      technologies: ["Python", "Tweepy (X/Twitter)", "Graph API (Insta)", "Gradio"],
      start: { month: "07", year: "2025" },
      end: { month: "08", year: "2025" },
      ongoing: true
    },
    previous: [
      {
        company: "Aivancity's partener",
        position: "AI Student",
        description: "Comparison of cyclists' routes with GPS data to determine the most frequented places on their route.",
        technologies: ["Python", "OSMnx", "Networkx", "Folium"],
        start: { month: "01", year: "2025" },
        end: { month: "04", year: "2025" },
        ongoing: false
      }
    ],
  },
  
  education: [
    {
      degree: "Master's Degree",
      program: "PGE (Grande Ecole Programme)",
      field: "Artificial Intelligence and Data Science",
      institution: "Aivancity",
      start: { month: "09", year: "2024" },
      end: { month: "09", year: "2029" },
      description: "Aivancity is an innovative school specialized in Artificial Intelligence and Data Science.\n\
      Its program blends technical, business, and ethical skills to train well-rounded AI professionals.\n\n\
      🧠 Interdisciplinary learning: tech, business & ethics\n\
      💼 Real-world projects with companies\n\
      🌍 Focus on societal impact and responsible AI\n\
      🔄 Lifelong learning through continued access to training",
      technologies: ["Python", "PyTorch", "NLP", "Machine Learning"],
      grade: null
    },
    {
      degree: "Bachelor's level",
      program: "CUPGE (University preparatory program for competitive graduate schools)",
      field: "Mathematics & Computer Science",
      institution: "Université of Caen Normandie",
      start: { month: "09", year: "2022" },
      end: { month: "04", year: "2024" },
      description: "I pursued the CUPGE Mathematics and Computer Science track driven by a strong interest in these fields.\n\
      This experience helped me better understand my professional goals, even though the university model wasn't the best fit for me.\n\
      It was a meaningful academic and personal step in shaping my career path.",
      technologies: ["Mathematics", "Computer Science", "Problem Solving"],
      grade: 9.074
    },
    {
      degree: "French General Baccalaureate",
      program: "General Baccalaureate with Mathematics and Computer Science Specializations",
      field: "Mathematics & Computer Science",
      institution: "Edmond Michelet High School",
      start: { month: "09", year: "2019" },
      end: { month: "06", year: "2022" },
      description: "Completed the French General Baccalaureate with specializations in Mathematics and Computer Science, including the 'Expert Mathematics' option.\n\
      Also studied Engineering Sciences as a third specialization.",
      technologies: [
        "Analytical Geometry",
        "Linear Algebra",
        "Algorithm Development",
        "Python (programming language)",
        "Mathematics",
        "Object-Oriented Programming",
        "Statistics",
        "Probability",
        "Computer Science"
      ],
      grade: 14.47
    }
  ],
  
  projects: [
    {
      id: "portfolio",
      name: "Personal Portfolio",
      description: "Modern portfolio with integrated AI chatbot",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "LangChain"],
      githubUrl: "https://github.com/Erazor48/ethan-portfolio",
      liveUrl: "https://ethan-portfolio-xi.vercel.app/",
      featured: true,
      start: { month: "06", year: "2025" },
      end: null,
      ongoing: true
    },
    {
      id: "eviverse",
      name: "Eviverse",
      description: "🛠️ 3D Object Generator – SaaS Project (in progress)\n\
      Personal project to build a 3D object generator, aiming to become a SaaS platform with project thread management.\n\
      Currently in early development — learning React for frontend work after gaining backend & API experience.",
      technologies: ["FastAPI", "SQLAlchemy", "React", "Tailwind CSS", "Batch Files"],
      githubUrl: "https://github.com/Erazor48/Eviverse",
      featured: true,
      start: { month: "04", year: "2025" },
      end: null,
      ongoing: true
    },
    {
      id: "youtube-clip-extractor",
      name: "YouTube Video Clip Extractor",
      description: "🎞️ YouTube Clip Extractor is a bilingual web application that lets you extract high-quality clips from any YouTube \
      video in just a few clicks. Simple interface, instant download, no technical skills required. Perfect for content creators, \
      teachers, and anyone who wants to save or share the best moments from YouTube.!",
      technologies: ["Gradio", "MoviePy", "yt-dlp"],
      githubUrl: "https://github.com/Erazor48/youtube-clip-extractor",
      featured: true,
      start: { month: "06", year: "2025" },
      end: { month: "06", year: "2025" },
      ongoing: false
    },
    {
      id: "path-finding",
      name: "Path Finding",
      description: "📍 Pathfinding Algorithm – Social Density Optimizer\n\
      Search for an optimal path maximizing the number of people encountered between two geographic locations.\n\
      Exploration of spatial algorithms with a real-world focus on social interaction and human flow.",
      technologies: ["Open Street Map", "NetworkX", "Folium"],
      featured: true,
      start: { month: "01", year: "2025" },
      end: { month: "04", year: "2025" },
      ongoing: false
    },
    {
      id: "music-player",
      name: "Music_Player",
      description: "🎵 Python Music Player – Simple desktop app\n\
      A lightweight music player built with tkinter and pygame. Browse folders of MP3 files, play, pause, skip tracks and \
      adjust volume in a clean, intuitive UI. Ideal for learning Python GUI and audio handling.",
      technologies: ["Python", "Tkinter", "Pygame"],
      githubUrl: "https://github.com/Erazor48/Music_Player",
      featured: true,
      start: { month: "03", year: "2025" },
      end: { month: "03", year: "2025" },
      ongoing: false
    },
    {
      id: "prompt-injection-giskard",
      name: "🔐 Securing LLMs from Prompt Injections with Giskard 🐢",
      description: "🎓 As part of a course project with a classmate, we explored prompt injection attacks by directly interacting with \
      large language models (LLMs) to understand their vulnerabilities. We also presented how the open-source tool \
      Giskard can help secure these models through automated testing and vulnerability detection.",
      technologies: ["Prompt Injection", "LLM Security", "Giskard", "AI Safety"],
      githubUrl: "https://github.com/Erazor48/prompt-injection-giskard",
      featured: true,
      start: { month: "03", year: "2025" },
      end: { month: "03", year: "2025" },
      ongoing: false
    },
    {
      id: "energy-sobriety-analysis",
      name: "⚡ Energy Sobriety Data Analysis",
      description: "📊 Analyzed French energy consumption data to reveal key trends and propose smart, sustainable solutions.\n\
      🧠 Used Python & Power BI to visualize, simulate, and support energy-saving strategies.",
      technologies: ["Data Analysis", "Pandas", "Matplotlib", "Seaborn", "Python", "Power BI"],
      featured: true,
      start: { month: "10", year: "2024" },
      end: { month: "12", year: "2024" },
      ongoing: false
    },
  ],
  
  social: {
    github: "https://github.com/Erazor48",
    linkedin: "https://www.linkedin.com/in/ethan-orain",
    portfolio: "https://ethan-portfolio-xi.vercel.app",
  },
}; 
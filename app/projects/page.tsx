"use client"

// app/projects/page.tsx
import ProjectCard from "@/components/ProjectCard";
import { projectAutomationService } from "@/lib/services/project-automation";
import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const automatedProjects = await projectAutomationService.getAutomatedProjects();
        
        // If no automated projects, fallback to featured projects
        if (automatedProjects.length === 0) {
          const featuredProjects = await projectAutomationService.getFeaturedProjects();
          setProjects(featuredProjects);
        } else {
          setProjects(automatedProjects);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects');
        // Fallback to default projects
        setProjects([
          {
            id: "eviverse",
            name: "Eviverse",
            description: "🛠️ 3D Object Generator – SaaS Project (in progress) Personal project to build a 3D object generator, aiming to become a SaaS platform with project thread management.",
            technologies: ["FastAPI", "SQLAlchemy", "React", "Tailwind CSS"],
            githubUrl: "https://github.com/Erazor48/Eviverse",
            featured: true
          },
          {
            id: "youtube-clip-extractor",
            name: "YouTube Video Clip Extractor",
            description: "🎞️ YouTube Clip Extractor is a bilingual web application that lets you extract high-quality clips from any YouTube video in just a few clicks.",
            technologies: ["Gradio", "MoviePy", "yt-dlp"],
            githubUrl: "https://github.com/Erazor48/youtube-clip-extractor",
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Projects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-20 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Projects</h1>
        <div className="text-red-400 mb-6">{error}</div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              tech={project.technologies?.join(" · ") || ""}
              description={project.description}
              github={project.githubUrl}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            tech={project.technologies?.join(" · ") || ""}
            description={project.description}
            github={project.githubUrl}
          />
        ))}
      </div>
    </div>
  );
}

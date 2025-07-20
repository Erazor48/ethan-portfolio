"use client"

// app/projects/page.tsx
import ProjectCard from "@/components/ProjectCard";
import { projectAutomationService } from "@/lib/services/project-automation";
import { useEffect, useState } from "react";
import { dataService } from "@/lib/services/data-service";
import AnimatedSection from "@/components/AnimatedSection";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        let githubProjects: any[] = [];
        let localProjects: any[] = [];
        let useGithub = false;
        try {
          githubProjects = await projectAutomationService.getAutomatedProjects();
          useGithub = Array.isArray(githubProjects) && githubProjects.length > 0;
        } catch (err) {
          githubProjects = [];
          useGithub = false;
        }
        // Charger et filtrer les projets locaux pour unicité par id
        try {
          const data = await dataService.getPersonalData();
          const seenIds = new Set<string>();
          localProjects = (data.projects || []).filter(p => {
            const id = p.id.trim().toLowerCase();
            if (seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
          });
        } catch (err) {
          localProjects = [];
        }
        if (useGithub) {
          const githubIds = new Set(githubProjects.map(p => p.id.trim().toLowerCase()));
          const filteredLocal = localProjects.filter(p => {
            const id = p.id.trim().toLowerCase();
            return !githubIds.has(id);
          });
          setProjects([...githubProjects, ...filteredLocal]);
        } else {
          setProjects(localProjects);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects');
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
      <AnimatedSection delay={0.1}>
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Projects</h1>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
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
      </AnimatedSection>
    </div>
  );
}

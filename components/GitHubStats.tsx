"use client"

import { projectAutomationService } from "@/lib/services/project-automation";
import { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";

export default function GitHubStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const projectStats = await projectAutomationService.getProjectStats();
        setStats(projectStats);
      } catch (error) {
        console.error('Error loading GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <SiGithub className="text-secondary-fg" size={24} />
          <h3 className="text-xl font-semibold text-primary-fg">GitHub Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-muted-primary rounded mb-2"></div>
              <div className="h-4 bg-muted-primary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-card p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <SiGithub className="text-secondary-fg" size={24} />
        <h3 className="text-xl font-semibold text-primary-fg">GitHub Statistics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-fg">{stats.totalProjects}</div>
          <div className="text-muted-primary-fg text-sm">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-fg">{stats.totalStars}</div>
          <div className="text-muted-primary-fg text-sm">Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-fg">{stats.totalForks}</div>
          <div className="text-muted-primary-fg text-sm">Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-fg">{stats.topTechnologies?.length || 0}</div>
          <div className="text-muted-primary-fg text-sm">Technologies</div>
        </div>
      </div>
      {stats.topTechnologies && stats.topTechnologies.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-card-fg mb-2">Top Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topTechnologies.slice(0, 5).map((tech: string) => (
              <span key={tech} className="bg-skills text-primary-fg px-2 py-1 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
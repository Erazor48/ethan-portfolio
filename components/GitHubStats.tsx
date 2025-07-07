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
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <SiGithub className="text-cyan-400" size={24} />
          <h3 className="text-xl font-semibold text-white">GitHub Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <SiGithub className="text-cyan-400" size={24} />
        <h3 className="text-xl font-semibold text-white">GitHub Statistics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalProjects}</div>
          <div className="text-gray-400 text-sm">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalStars}</div>
          <div className="text-gray-400 text-sm">Stars</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalForks}</div>
          <div className="text-gray-400 text-sm">Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.topTechnologies?.length || 0}</div>
          <div className="text-gray-400 text-sm">Technologies</div>
        </div>
      </div>
      {stats.topTechnologies && stats.topTechnologies.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topTechnologies.slice(0, 5).map((tech: string) => (
              <span key={tech} className="bg-cyan-700 text-white px-2 py-1 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 